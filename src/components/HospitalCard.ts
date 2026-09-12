import { HealthcareFacility } from '../types/health';

export function renderHospitalCard(facility: HealthcareFacility): string {
  const is24x7 = facility.isOpen24x7;
  const tagClass = is24x7 ? 'badge--green' : 'badge--paper';
  const tagText = is24x7 ? '🟢 24/7 OPEN' : '🕒 8 AM – 8 PM';
  const driveTime = facility.estimatedDriveTimeMin ? ` (~${facility.estimatedDriveTimeMin} mins)` : '';

  const specialtyBadges = facility.specialties
    ? facility.specialties
        .slice(0, 3)
        .map((s) => `<span style="display: inline-block; font-size: 0.72rem; padding: 2px 7px; background: rgba(16, 185, 129, 0.08); color: var(--color-primary-dark); border-radius: 4px; font-weight: 600;">${s}</span>`)
        .join(' ')
    : '';

  return `
    <div class="hospital-card" id="facility-${facility.id}" style="transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer;" onclick="window.focusFacilityOnMap('${facility.id}')">
      <div class="hospital-card__header">
        <div>
          <h3 class="hospital-card__name" style="font-size: 1.05rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 2px;">
            ${facility.name}
          </h3>
          <div class="hospital-card__type" style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary-dark);">
            ${facility.type}
          </div>
        </div>
        <span class="badge ${tagClass}" style="flex-shrink: 0;">${tagText}</span>
      </div>

      <div style="font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 6px; display: flex; align-items: flex-start; gap: 6px;">
        <span style="flex-shrink: 0;">📍</span>
        <span>${facility.address}</span>
      </div>

      ${
        specialtyBadges
          ? `<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
               ${specialtyBadges}
             </div>`
          : ''
      }

      <div class="hospital-card__meta" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
        <span class="hospital-card__distance" style="font-weight: 700; color: var(--color-text-main); font-size: 0.82rem;">
          🚗 ${facility.distanceKm} km away<span style="font-weight: 400; color: var(--color-text-muted);">${driveTime}</span>
        </span>
        ${facility.hasAmbulance ? '<span class="badge badge--black" style="font-size: 0.72rem;">🚑 Ambulance Ready</span>' : ''}
        ${facility.hasEmergencyBed ? '<span class="badge badge--red" style="font-size: 0.72rem;">🛏️ Emergency Beds</span>' : ''}
      </div>

      <div class="hospital-card__actions" style="margin-top: 12px; display: flex; gap: 8px;" onclick="event.stopPropagation();">
        <a href="tel:${facility.phone.replace(/[^0-9+]/g, '')}" class="btn btn--primary btn--sm" style="flex: 1; text-align: center; justify-content: center; font-size: 0.82rem;">
          📞 Call Center
        </a>
        <button type="button" class="btn btn--secondary btn--sm" style="flex: 1; justify-content: center; font-size: 0.82rem;" onclick="window.focusFacilityOnMap('${facility.id}')">
          🗺️ Show on Map
        </button>
        <button type="button" class="btn btn--outline btn--sm" style="flex: 1; justify-content: center; font-size: 0.82rem;" onclick="window.openDirections('${facility.name}', '${facility.address}')">
          🧭 Navigate
        </button>
      </div>
    </div>
  `;
}
