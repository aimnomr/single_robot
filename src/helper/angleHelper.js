export function quaternionToEuler(q) {
  const { x, y, z, w } = q;
  // Roll (rotation around X-axis)
  const sinr_cosp = 2 * (w * x + y * z);
  const cosr_cosp = 1 - 2 * (x * x + y * y);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  // Pitch (rotation around Y-axis)
  const sinp = 2 * (w * y - z * x);
  const pitch = Math.abs(sinp) >= 1
    ? Math.sign(sinp) * (Math.PI / 2)  // clamp to ±90°
    : Math.asin(sinp);

  // Yaw (rotation around Z-axis)
  const siny_cosp = 2 * (w * z + x * y);
  const cosy_cosp = 1 - 2 * (y * y + z * z);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return {
    x:  roll  * (180 / Math.PI),  // in degrees
    y: pitch * (180 / Math.PI),
    z:   yaw   * (180 / Math.PI),
  };
}

export function eulerToQuaternion(q) {
  const { x, y, z } = q;

  // Convert degrees to radians
  const roll  = x * (Math.PI / 180);
  const pitch = y * (Math.PI / 180);
  const yaw   = z * (Math.PI / 180);

  // Pre-compute half-angle trig
  const cr = Math.cos(roll  / 2);
  const sr = Math.sin(roll  / 2);
  const cp = Math.cos(pitch / 2);
  const sp = Math.sin(pitch / 2);
  const cy = Math.cos(yaw   / 2);
  const sy = Math.sin(yaw   / 2);

  return {
    w: cr * cp * cy + sr * sp * sy,
    x: sr * cp * cy - cr * sp * sy,
    y: cr * sp * cy + sr * cp * sy,
    z: cr * cp * sy - sr * sp * cy,
  };
}