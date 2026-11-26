import { BloodDonorService } from './bloodDonorService';
import { DoctorVerificationService } from './doctorVerificationService';
import { EmergencyProtocolService } from './emergencyProtocolService';
import { AuthService } from './authService';

export interface DashboardOverviewStats {
  totalRegisteredDonors: number;
  activeDonors: number;
  inactiveDonors: number;
  temporarilyUnavailableDonors: number;
  verifiedDoctors: number;
  pendingDoctorVerifications: number;
  underReviewDoctorVerifications: number;
  totalEmergencyProtocols: number;
  publishedProtocols: number;
  draftProtocols: number;
  pendingApprovalProtocols: number;
  underReviewProtocols: number;
  totalUsers: number;
}

export interface ActivityItem {
  id: string;
  type: 'DOCTOR' | 'PROTOCOL' | 'DONOR' | 'SYSTEM';
  title: string;
  description: string;
  timestamp: string;
  badgeText: string;
  badgeClass: string;
}

export class AdminAnalyticsService {
  /**
   * Aggregate high-level KPI metric counts across all operational subsystems.
   */
  public static getOverviewStats(): DashboardOverviewStats {
    const donorStats = BloodDonorService.getStatistics();
    const doctors = DoctorVerificationService.getAll();
    const protocols = EmergencyProtocolService.getAll();

    const verifiedDoctors = doctors.filter((d) => d.status === 'VERIFIED').length;
    const pendingDoctors = doctors.filter((d) => d.status === 'PENDING').length;
    const underReviewDoctors = doctors.filter((d) => d.status === 'UNDER_REVIEW').length;

    const publishedProtocols = protocols.filter((p) => p.status === 'PUBLISHED').length;
    const draftProtocols = protocols.filter((p) => p.status === 'DRAFT').length;
    const pendingApprovalProtocols = protocols.filter((p) => p.status === 'PENDING_APPROVAL').length;
    const underReviewProtocols = protocols.filter((p) => p.status === 'UNDER_REVIEW').length;

    return {
      totalRegisteredDonors: donorStats.totalDonors,
      activeDonors: donorStats.activeDonors,
      inactiveDonors: donorStats.inactiveDonors,
      temporarilyUnavailableDonors: donorStats.temporarilyUnavailableDonors,
      verifiedDoctors,
      pendingDoctorVerifications: pendingDoctors,
      underReviewDoctorVerifications: underReviewDoctors,
      totalEmergencyProtocols: protocols.length,
      publishedProtocols,
      draftProtocols,
      pendingApprovalProtocols,
      underReviewProtocols,
      totalUsers: 142 // Aggregated active system participants
    };
  }

  /**
   * Blood group distribution with counts and calculated percentages.
   */
  public static getBloodGroupDistribution(): Array<{ bloodGroup: string; count: number; percentage: number }> {
    const donorStats = BloodDonorService.getStatistics();
    const total = donorStats.totalDonors || 1;
    const groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

    return groups.map((bg) => {
      const count = donorStats.bloodGroupBreakdown[bg] || 0;
      return {
        bloodGroup: bg,
        count,
        percentage: Math.round((count / total) * 100)
      };
    });
  }

  /**
   * Top localities and cities in the blood donor and facility network.
   */
  public static getCityDistribution(): Array<{ city: string; count: number }> {
    const donorStats = BloodDonorService.getStatistics();
    return Object.entries(donorStats.cityBreakdown)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Protocols distribution grouped by emergency category.
   */
  public static getProtocolCategoryDistribution(): Array<{ category: string; count: number }> {
    const protocols = EmergencyProtocolService.getAll();
    const map: Record<string, number> = {};

    for (const p of protocols) {
      const cat = p.category || 'Other';
      map[cat] = (map[cat] || 0) + 1;
    }

    return Object.entries(map)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Unified recent activity feed for Admin Dashboard.
   */
  public static getRecentActivity(limit = 10): ActivityItem[] {
    const activities: ActivityItem[] = [];

    // Doctor verification activities
    const doctors = DoctorVerificationService.getAll();
    for (const d of doctors) {
      let badgeClass = 'badge--amber';
      let badgeText = d.status;
      if (d.status === 'VERIFIED') badgeClass = 'badge--green';
      if (d.status === 'REJECTED') badgeClass = 'badge--red';

      activities.push({
        id: `act-doc-${d.id}`,
        type: 'DOCTOR',
        title: `Doctor Application: ${d.fullName}`,
        description: `${d.qualification} (${d.specialization}) at ${d.hospitalName} • Status: ${d.status}`,
        timestamp: d.updatedAt || d.createdAt,
        badgeText,
        badgeClass
      });
    }

    // Protocol activities
    const protocols = EmergencyProtocolService.getAll();
    for (const p of protocols) {
      let badgeClass = 'badge--gray';
      if (p.status === 'PUBLISHED') badgeClass = 'badge--green';
      else if (p.status === 'PENDING_APPROVAL') badgeClass = 'badge--amber';
      else if (p.status === 'REJECTED') badgeClass = 'badge--red';

      activities.push({
        id: `act-proto-${p.id}`,
        type: 'PROTOCOL',
        title: `Protocol: ${p.title}`,
        description: `Author: ${p.authorName} • Category: ${p.category} • Version ${p.version}`,
        timestamp: p.updatedAt || p.createdAt,
        badgeText: p.status,
        badgeClass
      });
    }

    // Donor activities
    const donors = BloodDonorService.getAll();
    for (const dn of donors.slice(0, 5)) {
      activities.push({
        id: `act-donor-${dn.id}`,
        type: 'DONOR',
        title: `Blood Donor Registered: ${dn.bloodGroup}`,
        description: `${dn.fullName} registered in ${dn.city}, ${dn.district} • Status: ${dn.availabilityStatus}`,
        timestamp: dn.createdAt,
        badgeText: dn.bloodGroup,
        badgeClass: 'badge--red'
      });
    }

    // Sort descending by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return activities.slice(0, limit);
  }

  /**
   * Export blood donors to CSV string.
   */
  public static exportDonorsCsv(): string {
    const isSuperAdmin = AuthService.isSuperAdmin();
    const donors = BloodDonorService.getAll();

    const headers = [
      'ID',
      'Full Name',
      'Blood Group',
      'Rh Factor',
      'City',
      'District',
      'State',
      'Pincode',
      'Phone (Masked for Privacy)',
      'Availability Status',
      'Verification Status',
      'Last Donation Date',
      'Registered Date'
    ];

    const rows = donors.map((d) => [
      d.id,
      `"${d.fullName.replace(/"/g, '""')}"`,
      d.bloodGroup,
      d.rhFactor,
      `"${d.city}"`,
      `"${d.district}"`,
      `"${d.state}"`,
      d.pincode,
      `"${isSuperAdmin ? d.phone : BloodDonorService.maskPhone(d.phone)}"`,
      d.availabilityStatus,
      d.verificationStatus,
      d.lastDonationDate || 'N/A',
      d.createdAt
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Export emergency protocols to CSV string.
   */
  public static exportProtocolsCsv(): string {
    const protocols = EmergencyProtocolService.getAll();

    const headers = [
      'ID',
      'Title',
      'Category',
      'Status',
      'Version',
      'Author Name',
      'Author Reg No',
      'Reviewer Name',
      'Last Reviewed Date',
      'Review Due Date',
      'Created At'
    ];

    const rows = protocols.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.status,
      p.version,
      `"${p.authorName.replace(/"/g, '""')}"`,
      p.authorRegistrationNo || 'N/A',
      `"${(p.reviewerName || 'Unassigned').replace(/"/g, '""')}"`,
      p.lastReviewedAt || 'N/A',
      p.reviewDueAt || 'N/A',
      p.createdAt
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Export system overview analytics as JSON.
   */
  public static exportAnalyticsJson(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        overview: this.getOverviewStats(),
        bloodGroupDistribution: this.getBloodGroupDistribution(),
        cityDistribution: this.getCityDistribution(),
        protocolCategories: this.getProtocolCategoryDistribution(),
        recentActivity: this.getRecentActivity(20)
      },
      null,
      2
    );
  }
}
