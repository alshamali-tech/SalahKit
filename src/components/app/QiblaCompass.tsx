import { useEffect, useMemo, useRef, useState } from 'react';
import { compassPoint, distanceToKaabaKm, qiblaBearingDeg } from '../../lib/core/qibla';
import { CITIES, findCity } from '../../lib/core/geo';
import { formatDistanceKm } from '../../lib/utils/format';
import {
  angleLerp,
  normalizeDeg360,
  orientationPermissionRequired,
  requestOrientationPermission,
  shortestDelta,
  subscribeHeading,
  supportsOrientation,
} from '../../lib/utils/heading';
import { fetchDeclination } from '../../lib/external/declination';
import { bundledDeclination, formatDeclination } from '../../lib/core/geomag/declination';
import { useApp } from '../../store';
import { useT } from '../../lib/use-locale';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { QiblaDial } from './QiblaDial';

/** Declination value plus where it came from (for the status card). */
interface CompassDeclination {
  value: number;
  source: 'bundled' | 'noaa' | 'cache';
}

type CompassStatus = 'manual' | 'request-permission' | 'denied' | 'starting' | 'calibrating' | 'live' | 'stale';

/** Alignment tolerance in degrees. */
const ALIGNED_TOLERANCE_DEG = 5;

const STATUS_HINTS: Readonly<Record<CompassStatus, string>> = {
  manual: 'No motion sensors on this device — showing the fixed bearing as a needle.',
  'request-permission': 'Compass is ready — tap the button to allow motion & orientation access.',
  denied: 'Permission denied. Enable “Motion & Orientation” for this site in browser settings.',
  starting: 'Waiting for the compass sensors…',
  calibrating: 'Getting a fix — move your phone slowly in a figure-8.',
  live: 'Hold the phone flat and rotate until the amber marker reaches the top index.',
  stale: 'Compass paused — move your device gently to resume.',
};

/**
 * Smart Qibla module: live tilt-compensated magnetic heading, NOAA
 * declination applied for true north, alignment feedback with haptics,
 * and a manual needle fallback for sensor-less devices.
 * @returns The rendered module.
 */
export function QiblaCompass(): JSX.Element {
  const { settings, updateSettings } = useApp();
  const { t } = useT();
  const [status, setStatus] = useState<CompassStatus>('starting');
  const [heading, setHeading] = useState<number | null>(null);
  const [declination, setDeclination] = useState<CompassDeclination | null>(null);
  const [permissionAsked, setPermissionAsked] = useState(false);
  const smoothedRef = useRef<number | null>(null);
  const lastEventRef = useRef(0);
  const alignedRef = useRef(false);
  const declinationRef = useRef(0);
  const statusRef = useRef<CompassStatus>('starting');
  statusRef.current = status;

  const city = findCity(settings.city);
  const bearing = useMemo(
    () => qiblaBearingDeg(settings.latitude, settings.longitude),
    [settings.latitude, settings.longitude]
  );
  const distance = useMemo(
    () => distanceToKaabaKm(settings.latitude, settings.longitude),
    [settings.latitude, settings.longitude]
  );

  // Offline-first true north: the bundled WMM model applies instantly;
  // NOAA Geomag refines it only when it returns a live/cached value.
  useEffect(() => {
    let cancelled = false;
    const bundled = bundledDeclination(settings.city, settings.latitude, settings.longitude);
    declinationRef.current = bundled.value;
    setDeclination({ value: bundled.value, source: 'bundled' });
    void fetchDeclination(settings.latitude, settings.longitude).then((d) => {
      if (cancelled || !d) return;
      if (d.source === 'noaa' || d.source === 'cache') {
        declinationRef.current = d.value;
        setDeclination({ value: d.value, source: d.source });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [settings.latitude, settings.longitude, settings.city]);

  useEffect(() => {
    if (!supportsOrientation()) {
      setStatus('manual');
      return;
    }
    if (orientationPermissionRequired() && !permissionAsked) {
      setStatus('request-permission');
      return;
    }
    setStatus('starting');
    smoothedRef.current = null;
    const startedAt = Date.now();
    const unsubscribe = subscribeHeading((sample) => {
      lastEventRef.current = Date.now();
      if (sample.headingMagnetic === null) {
        setStatus((s) => (s === 'live' ? s : 'calibrating'));
        return;
      }
      const trueNorth = normalizeDeg360(sample.headingMagnetic + declinationRef.current);
      const smoothed =
        smoothedRef.current === null ? trueNorth : angleLerp(smoothedRef.current, trueNorth, 0.22);
      smoothedRef.current = smoothed;
      setHeading(smoothed);
      setStatus('live');
    });
    const watchdog = window.setInterval(() => {
      const current = statusRef.current;
      const idle = Date.now() - lastEventRef.current;
      if ((current === 'live' || current === 'starting') && lastEventRef.current > 0 && idle > 2000) {
        setStatus('stale');
      } else if (current === 'stale' && idle < 2000) {
        setStatus('live');
      } else if (current === 'starting' && lastEventRef.current === 0 && idle > 0 && Date.now() - startedAt > 2500) {
        setStatus('calibrating');
      }
    }, 700);
    return () => {
      unsubscribe();
      window.clearInterval(watchdog);
    };
  }, [permissionAsked]);

  const delta = heading === null ? null : shortestDelta(heading, bearing);
  const aligned = delta !== null && Math.abs(delta) <= ALIGNED_TOLERANCE_DEG;

  useEffect(() => {
    if (aligned && !alignedRef.current) {
      alignedRef.current = true;
      try {
        if ('vibrate' in navigator) navigator.vibrate(60);
      } catch {
        // Haptics unavailable; the visual glow already confirms.
      }
    }
    if (!aligned) alignedRef.current = false;
  }, [aligned]);

  /** iOS gesture-gated sensor unlock. */
  async function enableCompass(): Promise<void> {
    setPermissionAsked(true);
    const result = await requestOrientationPermission();
    if (result === 'denied') setStatus('denied');
  }

  const sensorLive = status === 'live' || status === 'stale' || status === 'calibrating';
  const hub = buildHub(status, aligned, delta, bearing);

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden">
        <div className="bg-pattern drift-slow absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col items-center gap-4 px-4 py-7">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {status === 'live' ? (
              <Badge tone="success">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-[pulseDot_1.6s_ease-in-out_infinite]" aria-hidden="true" />
                {t('modulesUi.qibla.liveCompass')}
              </Badge>
            ) : status === 'manual' ? (
              <Badge tone="neutral">{t('modulesUi.qibla.manualDial')}</Badge>
            ) : status === 'denied' ? (
              <Badge tone="danger">{t('modulesUi.qibla.sensorBlocked')}</Badge>
            ) : (
              <Badge tone="warning">{status === 'stale' ? t('modulesUi.qibla.paused') : t('modulesUi.qibla.acquiring')}</Badge>
            )}
            {sensorLive && declination ? (
              <Badge tone="primary">
                {t('modulesUi.qibla.trueNorth')} {declination.value >= 0 ? '+' : ''}
                {declination.value.toFixed(1)}°
              </Badge>
            ) : null}
          </div>

          <QiblaDial
            rotationDeg={heading === null || status === 'manual' ? 0 : -heading}
            bearingDeg={bearing}
            manual={status === 'manual'}
            aligned={aligned}
            hub={hub}
          />

          <div className="text-center min-w-0">
            {aligned ? (
              <p className="text-2xl sm:text-3xl font-extrabold text-[var(--success)] animate-[fadeIn_200ms_ease-out]">
                {t('modulesUi.qibla.facing')}
              </p>
            ) : delta !== null ? (
              <p className="text-2xl sm:text-3xl font-extrabold text-[var(--fg)]">
                {delta > 0 ? t('modulesUi.qibla.turnRight') : t('modulesUi.qibla.turnLeft')} · <span className="tnum">{Math.abs(Math.round(delta))}°</span> {t('modulesUi.qibla.toGo')}
              </p>
            ) : (
              <p className="text-lg font-bold text-[var(--fg)]">
                {t('modulesUi.qibla.qiblaIs')} <span className="tnum">{Math.round(bearing)}°</span> {t('modulesUi.qibla.fromNorth')}
              </p>
            )}
            <p className="mt-1.5 text-xs text-[var(--muted)] max-w-sm">{STATUS_HINTS[status]}</p>
          </div>

          {status === 'request-permission' ? (
            <Button variant="amber" onClick={() => void enableCompass()}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="10" cy="10" r="7" />
                <path d="M13 7l-2.2 5.2L5.6 14l1.8-4.8z" strokeLinejoin="round" />
              </svg>
              {t('modulesUi.qibla.enable')}
            </Button>
          ) : null}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card tone="raised">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">{t('modulesUi.qibla.bearing')}</p>
          <p className="mt-1 text-4xl font-extrabold tnum text-[var(--fg)]">
            {bearing.toFixed(1)}°
            <span className="ml-2 text-base font-bold text-[var(--muted)]">{compassPoint(bearing)}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="primary">{t('modulesUi.qibla.fromCity')} {city.name}</Badge>
            <Badge tone="neutral">{formatDistanceKm(distance)} {t('modulesUi.qibla.toKaaba')}</Badge>
          </div>
        </Card>

        <Card hover>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">{t('modulesUi.qibla.declination')}</p>
          <p className="mt-1 text-2xl font-extrabold tnum text-[var(--fg)]">
            {declination ? `${declination.value >= 0 ? '+' : '−'}${Math.abs(declination.value).toFixed(1)}°` : '…'}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
            {declination
              ? `${formatDeclination(declination.value)} · ${
                  declination.source === 'bundled'
                    ? t('modulesUi.qibla.bundledNote')
                    : declination.source === 'noaa'
                      ? t('modulesUi.qibla.noaaLive')
                      : t('modulesUi.qibla.noaaCached')
                }`
              : ''}
          </p>
        </Card>

        <Card hover>
          <Select
            label="Your city"
            id="qibla-city"
            value={settings.city}
            onChange={(e) => {
              const next = CITIES.find((c) => c.id === e.target.value);
              if (next) void updateSettings({ city: next.id, latitude: next.latitude, longitude: next.longitude });
            }}
            options={CITIES.map((c) => ({ value: c.id, label: `${c.name}, ${c.country}` }))}
          />
          <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">
            Great-circle direction from {city.name} to the Kaaba in Masjid al-Haram. Bearing is
            true north; sensor readings are corrected with local declination.
          </p>
        </Card>
      </div>
    </div>
  );
}

/**
 * Builds the hub readout content for a compass state.
 * @param status - Compass state machine value.
 * @param aligned - Within tolerance of the Qibla.
 * @param delta - Signed degrees to the Qibla (null when heading unknown).
 * @param bearing - Static bearing for manual mode.
 * @returns Hub JSX.
 */
function buildHub(
  status: CompassStatus,
  aligned: boolean,
  delta: number | null,
  bearing: number
): JSX.Element {
  if (status === 'manual') {
    return (
      <>
        <span className="text-2xl font-extrabold tnum text-[var(--fg)]">{Math.round(bearing)}°</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">needle</span>
      </>
    );
  }
  if (status === 'starting' || status === 'request-permission' || status === 'denied') {
    return (
      <span className="h-6 w-6 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin" aria-hidden="true" />
    );
  }
  if (aligned) {
    return (
      <span className="flex flex-col items-center gap-0.5 animate-[fadeIn_180ms_ease-out]">
        <svg width="26" height="26" viewBox="0 0 20 20" fill="none" stroke="var(--success)" strokeWidth="2.4" aria-hidden="true">
          <path d="M4 10.5l4 4L16 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm font-extrabold text-[var(--success)]">Qibla</span>
      </span>
    );
  }
  if (delta !== null) {
    return (
      <>
        <span className="text-3xl font-extrabold tnum text-[var(--fg)]">{Math.abs(Math.round(delta))}°</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
          {status === 'stale' ? 'paused' : delta > 0 ? 'turn right ↻' : 'turn left ↺'}
        </span>
      </>
    );
  }
  return (
    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] text-center px-2">
      calibrating
    </span>
  );
}
