import * as XLSX from 'xlsx';
import { diseaseData, DiseasePoint } from '@/data/diseaseData';
import { ngoData } from '@/data/ngoData';

export const exportDiseaseDataToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    diseaseData.map(d => ({
      'Disease': d.disease,
      'City': d.city,
      'State': d.state,
      'Street': d.street,
      'Cases': d.cases,
      'Severity': d.severity,
      'Last Reported': d.lastReported,
      'Description': d.description,
      'Latitude': d.lat,
      'Longitude': d.lng,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Disease Data');

  const fileName = `Disease_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportFilteredDiseaseData = (
  data: DiseasePoint[],
  filterName: string = 'Filtered'
) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(d => ({
      'Disease': d.disease,
      'City': d.city,
      'State': d.state,
      'Street': d.street,
      'Cases': d.cases,
      'Severity': d.severity,
      'Last Reported': d.lastReported,
      'Description': d.description,
      'Latitude': d.lat,
      'Longitude': d.lng,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Disease Data');

  const fileName = `Disease_Report_${filterName}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportStreetLevelReport = () => {
  // Street-wise breakdown
  const streetData = diseaseData.reduce((acc, d) => {
    const key = `${d.street}, ${d.city}`;
    if (!acc[key]) {
      acc[key] = {
        street: d.street,
        city: d.city,
        state: d.state,
        totalCases: 0,
        diseases: [] as string[],
        emergencyIncidents: 0,
        lastReported: d.lastReported,
      };
    }
    acc[key].totalCases += d.cases;
    if (!acc[key].diseases.includes(d.disease)) {
      acc[key].diseases.push(d.disease);
    }
    if (d.severity === 'emergency') {
      acc[key].emergencyIncidents += 1;
    }
    if (new Date(d.lastReported) > new Date(acc[key].lastReported)) {
      acc[key].lastReported = d.lastReported;
    }
    return acc;
  }, {} as Record<string, any>);

  const streetSheet = XLSX.utils.json_to_sheet(
    Object.values(streetData)
      .sort((a: any, b: any) => b.totalCases - a.totalCases)
      .map((item: any) => ({
        'Street': item.street,
        'City': item.city,
        'State': item.state,
        'Total Cases': item.totalCases,
        'Number of Diseases': item.diseases.length,
        'Diseases': item.diseases.join(', '),
        'Emergency Incidents': item.emergencyIncidents,
        'Last Reported': item.lastReported,
      }))
  );

  // City-wise street count
  const cityStreetCount = diseaseData.reduce((acc, d) => {
    if (!acc[d.city]) {
      acc[d.city] = {
        city: d.city,
        state: d.state,
        streets: new Set<string>(),
        totalCases: 0,
        emergencyCount: 0,
      };
    }
    acc[d.city].streets.add(d.street);
    acc[d.city].totalCases += d.cases;
    if (d.severity === 'emergency') acc[d.city].emergencyCount += 1;
    return acc;
  }, {} as Record<string, any>);

  const citySheet = XLSX.utils.json_to_sheet(
    Object.values(cityStreetCount)
      .sort((a: any, b: any) => b.totalCases - a.totalCases)
      .map((item: any) => ({
        'City': item.city,
        'State': item.state,
        'Affected Streets': item.streets.size,
        'Total Cases': item.totalCases,
        'Emergency Incidents': item.emergencyCount,
      }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, streetSheet, 'Street-wise Data');
  XLSX.utils.book_append_sheet(workbook, citySheet, 'City Summary');

  const fileName = `Street_Level_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportNGODataToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    ngoData.map(ngo => ({
      'NGO Name': ngo.name,
      'City': ngo.city,
      'Contact': ngo.contact,
      'Website': ngo.website,
      'Focus Areas': ngo.focus.join(', '),
      'Activities': ngo.assignedActivities.join(' | '),
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'NGO Data');

  const fileName = `NGO_Directory_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportAnalyticsToExcel = () => {
  // Severity Distribution
  const severityData = diseaseData.reduce((acc, d) => {
    acc[d.severity] = (acc[d.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severitySheet = XLSX.utils.json_to_sheet(
    Object.entries(severityData).map(([severity, count]) => ({
      'Severity Level': severity,
      'Number of Incidents': count,
      'Percentage': ((count / diseaseData.length) * 100).toFixed(2) + '%',
    }))
  );

  // State-wise Cases
  const stateData = diseaseData.reduce((acc, d) => {
    acc[d.state] = (acc[d.state] || 0) + d.cases;
    return acc;
  }, {} as Record<string, number>);

  const stateSheet = XLSX.utils.json_to_sheet(
    Object.entries(stateData)
      .sort((a, b) => b[1] - a[1])
      .map(([state, cases]) => ({
        'State': state,
        'Total Cases': cases,
      }))
  );

  // Disease Distribution
  const diseaseStats = diseaseData.reduce((acc, d) => {
    if (!acc[d.disease]) {
      acc[d.disease] = { count: 0, cases: 0 };
    }
    acc[d.disease].count += 1;
    acc[d.disease].cases += d.cases;
    return acc;
  }, {} as Record<string, { count: number; cases: number }>);

  const diseaseSheet = XLSX.utils.json_to_sheet(
    Object.entries(diseaseStats)
      .sort((a, b) => b[1].cases - a[1].cases)
      .map(([disease, data]) => ({
        'Disease': disease,
        'Number of Locations': data.count,
        'Total Cases': data.cases,
      }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, severitySheet, 'Severity Analysis');
  XLSX.utils.book_append_sheet(workbook, stateSheet, 'State-wise Cases');
  XLSX.utils.book_append_sheet(workbook, diseaseSheet, 'Disease Distribution');

  const fileName = `Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportDashboardReport = () => {
  const totalCases = diseaseData.reduce((sum, d) => sum + d.cases, 0);
  const emergencyCases = diseaseData.filter((d) => d.severity === 'emergency').length;
  const activeStates = new Set(diseaseData.map((d) => d.state)).size;

  // Summary Sheet
  const summarySheet = XLSX.utils.json_to_sheet([
    { 'Metric': 'Total Cases', 'Value': totalCases },
    { 'Metric': 'Emergency Incidents', 'Value': emergencyCases },
    { 'Metric': 'Active States', 'Value': activeStates },
    { 'Metric': 'Total NGO Partners', 'Value': ngoData.length },
    { 'Metric': 'Report Date', 'Value': new Date().toLocaleDateString() },
  ]);

  // Recent Alerts
  const recentAlerts = diseaseData
    .filter((d) => d.severity === 'emergency' || d.severity === 'doctor')
    .slice(0, 20);

  const alertsSheet = XLSX.utils.json_to_sheet(
    recentAlerts.map(d => ({
      'Disease': d.disease,
      'Location': `${d.street}, ${d.city}, ${d.state}`,
      'Cases': d.cases,
      'Severity': d.severity,
      'Description': d.description,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  XLSX.utils.book_append_sheet(workbook, alertsSheet, 'Recent Alerts');

  const fileName = `Dashboard_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
