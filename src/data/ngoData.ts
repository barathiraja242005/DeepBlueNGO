export type SubscriptionTier = 'free' | 'premium';

export interface NGO {
  id: string;
  name: string;
  city: string;
  state: string;
  contact: string;
  website: string;
  email?: string;
  focus: string[];
  assignedActivities: string[];
  established?: string;
  volunteers?: number;
  activeProjects?: number;
  status?: 'active' | 'inactive' | 'pending';
  subscription?: SubscriptionTier;
}

export const ngoData: NGO[] = [
  // Mumbai
  { id: 'ngo1', name: 'Mumbai Health Foundation', city: 'Mumbai', state: 'Maharashtra', contact: '+91 22 2345 6789', website: 'mumbaihealthfoundation.org', focus: ['Dengue', 'Malaria', 'Cholera'], assignedActivities: ['Mosquito fogging in Bandra & Dharavi', 'Clean water distribution at Colaba', 'Community health screening camps'] },
  { id: 'ngo2', name: 'SNEHA Foundation', city: 'Mumbai', state: 'Maharashtra', contact: '+91 22 2612 0081', website: 'snehamumbai.org', focus: ['Tuberculosis', 'Leptospirosis'], assignedActivities: ['TB awareness in Dadar chawls', 'Flood-preparedness kits in Kurla', 'Free diagnostic clinics at LBS Marg'] },

  // Delhi
  { id: 'ngo3', name: 'Delhi Health Initiative', city: 'Delhi', state: 'Delhi', contact: '+91 11 4567 8901', website: 'delhihealthinitiative.org', focus: ['Dengue', 'Chikungunya', 'Malaria'], assignedActivities: ['Anti-larval spraying in Chandni Chowk', 'Awareness drives in Rohini colonies', 'Mosquito net distribution in Laxmi Nagar'] },
  { id: 'ngo4', name: 'Safai Sena', city: 'Delhi', state: 'Delhi', contact: '+91 11 2345 1234', website: 'safaisena.net', focus: ['Cholera', 'Typhoid', 'Hepatitis A'], assignedActivities: ['Water purification at ITO underpass', 'Sanitation drives in Civil Lines', 'Hygiene education for street vendors'] },

  // Kolkata
  { id: 'ngo5', name: 'Kolkata Swasthya Sathi', city: 'Kolkata', state: 'West Bengal', contact: '+91 33 2456 7890', website: 'kolkataswasthya.org', focus: ['Dengue', 'Cholera', 'Malaria'], assignedActivities: ['Drain cleaning at Kidderpore docks', 'ORS distribution in Howrah', 'Medical camps at Salt Lake IT parks'] },
  { id: 'ngo6', name: 'Calcutta Rescue', city: 'Kolkata', state: 'West Bengal', contact: '+91 33 2217 8866', website: 'calcuttarescue.org', focus: ['Tuberculosis', 'Typhoid'], assignedActivities: ['Free TB medication in Dunlop', 'Clean water testing in Behala', 'Nutrition support for patients'] },

  // Chennai
  { id: 'ngo7', name: 'Chennai Cares', city: 'Chennai', state: 'Tamil Nadu', contact: '+91 44 2345 6789', website: 'chennaicares.org', focus: ['Dengue', 'Leptospirosis', 'Cholera'], assignedActivities: ['Storm drain de-silting in Tondiarpet', 'Dengue rapid testing at Anna Salai', 'Waterlogging clearance in T.Nagar'] },

  // Bengaluru
  { id: 'ngo8', name: 'Bengaluru Health Watch', city: 'Bengaluru', state: 'Karnataka', contact: '+91 80 2567 8901', website: 'blrhealthwatch.org', focus: ['Dengue', 'Chikungunya', 'Malaria'], assignedActivities: ['Lake cleanup in BTM Layout', 'Fumigation in Koramangala', 'Health cards for construction workers'] },

  // Hyderabad
  { id: 'ngo9', name: 'Hyderabad Civic Forum', city: 'Hyderabad', state: 'Telangana', contact: '+91 40 2345 6789', website: 'hydcivicforum.org', focus: ['Malaria', 'Cholera', 'Chikungunya'], assignedActivities: ['Sewer repair advocacy in Old City', 'Water tanker quality testing', 'Community awareness in Kukatpally'] },

  // Pune
  { id: 'ngo10', name: 'Pune Health Alliance', city: 'Pune', state: 'Maharashtra', contact: '+91 20 2567 8901', website: 'punehealthalliance.org', focus: ['Dengue', 'Leptospirosis', 'Hepatitis A'], assignedActivities: ['Anti-dengue campaign at FC Road hostels', 'Flood drainage at Kothrud hillside', 'Food safety audits on Laxmi Road'] },

  // Ahmedabad
  { id: 'ngo11', name: 'Gujarat Jan Swasthya', city: 'Ahmedabad', state: 'Gujarat', contact: '+91 79 2567 8901', website: 'gujjanswasthya.org', focus: ['Cholera', 'Malaria', 'Typhoid'], assignedActivities: ['Sabarmati riverbank sanitation', 'Malaria testing on SG Highway', 'Water purifier installation in Kalupur'] },

  // Lucknow
  { id: 'ngo12', name: 'Lucknow Swachh Mission', city: 'Lucknow', state: 'Uttar Pradesh', contact: '+91 522 234 5678', website: 'lucknowswachh.org', focus: ['Dengue', 'Japanese Encephalitis', 'Typhoid'], assignedActivities: ['JE vaccination drive at Aliganj', 'Dengue awareness in Hazratganj', 'Pipeline repair advocacy in Aminabad'] },

  // Jaipur
  { id: 'ngo13', name: 'Rajasthan Health Society', city: 'Jaipur', state: 'Rajasthan', contact: '+91 141 234 5678', website: 'rajhealthsociety.org', focus: ['Chikungunya', 'Dengue', 'Malaria'], assignedActivities: ['Water body treatment near Jal Mahal', 'Fumigation in Tonk Road colonies', 'Health camps at Sindhi Camp bus station'] },

  // Patna
  { id: 'ngo14', name: 'Bihar Health Action', city: 'Patna', state: 'Bihar', contact: '+91 612 234 5678', website: 'biharhealthaction.org', focus: ['Japanese Encephalitis', 'Cholera', 'Dengue'], assignedActivities: ['JE vaccination in Ganga flood zones', 'Bore well chlorination at Boring Rd', 'Mosquito net distribution at Kankarbagh'] },

  // Bhopal
  { id: 'ngo15', name: 'Bhopal Green Health', city: 'Bhopal', state: 'Madhya Pradesh', contact: '+91 755 234 5678', website: 'bhopalgreenhealth.org', focus: ['Dengue', 'Malaria', 'Tuberculosis'], assignedActivities: ['Lake maintenance in MP Nagar', 'TB screening in Shivaji Nagar', 'Anti-mosquito drive in Old City'] },

  // Kochi
  { id: 'ngo16', name: 'Kerala Swasthya Samithi', city: 'Kochi', state: 'Kerala', contact: '+91 484 234 5678', website: 'keralaswasthya.org', focus: ['Leptospirosis', 'Dengue', 'Hepatitis A'], assignedActivities: ['Post-flood cleanup in Ernakulam', 'Canal desilting at Edappally', 'Seafood safety monitoring in Fort Kochi'] },

  // Guwahati
  { id: 'ngo17', name: 'Assam Health Network', city: 'Guwahati', state: 'Assam', contact: '+91 361 234 5678', website: 'assamhealthnet.org', focus: ['Japanese Encephalitis', 'Malaria', 'Dengue'], assignedActivities: ['JE vaccination at Dispur', 'Malaria prophylaxis at Fancy Bazaar', 'Drainage repair advocacy at Zoo Rd'] },

  // Varanasi
  { id: 'ngo18', name: 'Kashi Jan Sewa', city: 'Varanasi', state: 'Uttar Pradesh', contact: '+91 542 234 5678', website: 'kashijansewa.org', focus: ['Cholera', 'Typhoid', 'Hepatitis A'], assignedActivities: ['Ghat water quality monitoring', 'Hygiene awareness at Godowlia market', 'Safe water supply at BHU hostel area'] },
];
