export enum OrderStatus {
  PENDING = 'pending',       // enviada, esperando revisión
  CONFIRMED = 'confirmed',   // cocina acepta
  PREPARING = 'preparing',   // cocina preparando
  READY = 'ready',           // lista para recoger
  PICKED_UP = 'picked_up',   // cliente recogió
  CANCELLED = 'cancelled',   // cocina rechazó
  ABANDONED = 'abandoned'    // cliente no recogió
}