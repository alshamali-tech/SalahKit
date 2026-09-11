/* 
 * TODO: Qibla compass is temporarily disabled due to bugs.
 * Will be re-enabled in the future when ready and bug-free.
 * 
 * Original imports:
 * import { useEffect, useMemo, useRef, useState } from 'react';
 * import { compassPoint, distanceToKaabaKm, qiblaBearingDeg } from '../../lib/core/qibla';
 * import { CITIES, findCity } from '../../lib/core/geo';
 * import { formatDistanceKm } from '../../lib/utils/format';
 * import {
 *   angleLerp,
 *   normalizeDeg360,
 *   orientationPermissionRequired,
 *   requestOrientationPermission,
 *   shortestDelta,
 *   subscribeHeading,
 *   supportsOrientation,
 * } from '../../lib/utils/heading';
 * import { fetchDeclination } from '../../lib/external/declination';
 * import { bundledDeclination, formatDeclination } from '../../lib/core/geomag/declination';
 * import { useApp } from '../../store';
 * import { useT } from '../../lib/use-locale';
 * import { Badge } from '../ui/Badge';
 * import { Button } from '../ui/Button';
 * import { Card } from '../ui/Card';
 * import { Select } from '../ui/Select';
 * import { QiblaDial } from './QiblaDial';
 */

import { Card } from '../ui/Card';

/**
 * Qibla compass is temporarily disabled.
 * @returns Placeholder component.
 */
export function QiblaCompass(): JSX.Element {
  return (
    <Card className="text-center py-12">
      <p className="text-lg font-bold text-[var(--fg)]">Qibla Compass</p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        This feature is temporarily disabled and will be re-enabled soon.
      </p>
    </Card>
  );
}
