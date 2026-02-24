import type { LatLngTuple } from 'leaflet';

export const parseCoordinates = (coordinates: LatLngTuple[]): LatLngTuple[] => {
  return coordinates.map((coordinate) => [coordinate[1], coordinate[0], coordinate[2]]);
};

function sub(a: LatLngTuple, b: LatLngTuple): LatLngTuple {
  return [a[0] - b[0], a[1] - b[1], a[2]! - b[2]!];
}

function add(a: LatLngTuple, b: LatLngTuple): LatLngTuple {
  return [a[0] + b[0], a[1] + b[1], a[2]! + b[2]!];
}

function scale(a: LatLngTuple, s: number): LatLngTuple {
  return [a[0] * s, a[1] * s, a[2]! * s];
}

function hermite(p0: LatLngTuple, p1: LatLngTuple, m0: LatLngTuple, m1: LatLngTuple, t: number): LatLngTuple {
  const t2 = t * t;
  const t3 = t2 * t;

  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  return add(add(scale(p0, h00), scale(m0, h10)), add(scale(p1, h01), scale(m1, h11)));
}

export function smoothSkiSlopeHermite(points: LatLngTuple[], samples = 8): LatLngTuple[] {
  const n = points.length;
  if (n < 2) return points;

  const result: LatLngTuple[] = [];

  for (let i = 0; i < n - 1; i++) {
    const pPrev = i === 0 ? points[i] : points[i - 1];
    const p0 = points[i];
    const p1 = points[i + 1];
    const pNext = i + 2 < n ? points[i + 2] : points[i + 1];

    // Tangentes controladas (suaves, sin oscilaciones)
    const m0 = scale(sub(p1, pPrev), 0.5);
    const m1 = scale(sub(pNext, p0), 0.5);

    // Mantener el punto original
    if (i === 0) result.push(p0);

    // Puntos intermedios
    for (let s = 1; s < samples; s++) {
      const t = s / samples;
      result.push(hermite(p0, p1, m0, m1, t));
    }

    // Mantener el punto final del segmento
    result.push(p1);
  }

  return result;
}
