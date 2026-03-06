export interface DiseasePoint {
  id: string;
  lat: number;
  lng: number;
  disease: string;
  severity: 'self-care' | 'doctor' | 'emergency';
  cases: number;
  street: string;
  city: string;
  state: string;
  lastReported: string;
  description: string;
}

export const diseases = [
  'Dengue Fever',
  'Malaria',
  'Cholera',
  'Typhoid',
  'Tuberculosis',
  'Leptospirosis',
  'Chikungunya',
  'Hepatitis A',
  'Influenza',
  'Japanese Encephalitis',
] as const;

export const severityColors: Record<string, string> = {
  'self-care': '#9cd4e1f3',
  'doctor': '#4988C4',
  'emergency': '#0F2854',
};

export const diseaseData: DiseasePoint[] = [
  // ─── MUMBAI ───
  { id: 'm1', lat: 19.076, lng: 72.8777, disease: 'Dengue Fever', severity: 'emergency', cases: 230, street: 'Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-03-05', description: 'Major dengue cluster near open drains and construction sites.' },
  { id: 'm2', lat: 19.0596, lng: 72.8295, disease: 'Malaria', severity: 'doctor', cases: 95, street: 'SV Road, Andheri West', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-03-04', description: 'Malaria cases rising due to poor drainage in suburbs.' },
  { id: 'm3', lat: 19.0176, lng: 72.8562, disease: 'Cholera', severity: 'emergency', cases: 45, street: '90 Feet Road, Dharavi', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-03-02', description: 'Waterborne outbreak in densely populated settlement.' },
  { id: 'm4', lat: 18.9388, lng: 72.8354, disease: 'Typhoid', severity: 'doctor', cases: 28, street: 'Shahid Bhagat Singh Rd, Colaba', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-02-27', description: 'Typhoid from contaminated pipeline in heritage precinct.' },
  { id: 'm5', lat: 19.1136, lng: 72.8697, disease: 'Leptospirosis', severity: 'doctor', cases: 38, street: 'LBS Marg, Kurla West', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-02-20', description: 'Flooding-related leptospirosis in low-lying area.' },
  { id: 'm6', lat: 19.0895, lng: 72.8656, disease: 'Dengue Fever', severity: 'doctor', cases: 82, street: 'Sion-Trombay Rd, Chembur', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-03-03', description: 'Dengue hotspot near mangrove marshland.' },
  { id: 'm7', lat: 19.186, lng: 72.8347, disease: 'Malaria', severity: 'doctor', cases: 33, street: 'Mira-Bhayander Rd, Mira Road', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-02-15', description: 'Stagnant water breeding mosquitoes near railway.' },
  { id: 'm8', lat: 19.0425, lng: 72.82, disease: 'Hepatitis A', severity: 'self-care', cases: 11, street: 'Hill Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-02-10', description: 'Isolated cases traced to street food stall.' },
  { id: 'm9', lat: 19.0255, lng: 72.8416, disease: 'Tuberculosis', severity: 'doctor', cases: 54, street: 'Dr Ambedkar Rd, Dadar East', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-03-01', description: 'TB cluster among migrant workers in chawl housing.' },
  { id: 'm10', lat: 19.1, lng: 72.908, disease: 'Chikungunya', severity: 'doctor', cases: 29, street: 'Ghatkopar-Mankhurd Link Rd', city: 'Mumbai', state: 'Maharashtra', lastReported: '2026-02-22', description: 'Chikungunya cases near construction debris sites.' },

  // ─── DELHI ───
  { id: 'd1', lat: 28.6139, lng: 77.209, disease: 'Dengue Fever', severity: 'emergency', cases: 410, street: 'Chandni Chowk Main Bazaar', city: 'Delhi', state: 'Delhi', lastReported: '2026-03-05', description: 'Massive dengue outbreak in congested old Delhi lanes.' },
  { id: 'd2', lat: 28.6353, lng: 77.225, disease: 'Typhoid', severity: 'doctor', cases: 67, street: 'Nicholson Rd, Civil Lines', city: 'Delhi', state: 'Delhi', lastReported: '2026-03-01', description: 'Typhoid from underground pipe leakage.' },
  { id: 'd3', lat: 28.5672, lng: 77.2101, disease: 'Cholera', severity: 'doctor', cases: 19, street: 'Harkesh Nagar, Nehru Place', city: 'Delhi', state: 'Delhi', lastReported: '2026-02-18', description: 'Cholera cases near open sewer in commercial district.' },
  { id: 'd4', lat: 28.6992, lng: 77.1466, disease: 'Chikungunya', severity: 'doctor', cases: 85, street: 'Sector 7, Rohini', city: 'Delhi', state: 'Delhi', lastReported: '2026-03-03', description: 'Chikungunya surge in residential colony parks.' },
  { id: 'd5', lat: 28.5245, lng: 77.1855, disease: 'Malaria', severity: 'doctor', cases: 42, street: 'Nelson Mandela Marg, Vasant Kunj', city: 'Delhi', state: 'Delhi', lastReported: '2026-02-25', description: 'Malaria near construction sites with stagnant water pools.' },
  { id: 'd6', lat: 28.6508, lng: 77.3152, disease: 'Dengue Fever', severity: 'doctor', cases: 156, street: 'Vikas Marg, Laxmi Nagar', city: 'Delhi', state: 'Delhi', lastReported: '2026-03-04', description: 'Dengue hotspot near Yamuna flood plains.' },
  { id: 'd7', lat: 28.6718, lng: 77.2321, disease: 'Tuberculosis', severity: 'doctor', cases: 48, street: 'GT Road, Kashmere Gate', city: 'Delhi', state: 'Delhi', lastReported: '2026-02-28', description: 'TB cases in overcrowded old city tenements.' },
  { id: 'd8', lat: 28.5436, lng: 77.2705, disease: 'Hepatitis A', severity: 'self-care', cases: 14, street: 'Mathura Rd, Faridabad Border', city: 'Delhi', state: 'Delhi', lastReported: '2026-02-12', description: 'Hepatitis traced to roadside eatery cluster.' },
  { id: 'd9', lat: 28.6127, lng: 77.2295, disease: 'Japanese Encephalitis', severity: 'doctor', cases: 9, street: 'Ring Road, ITO', city: 'Delhi', state: 'Delhi', lastReported: '2026-02-08', description: 'Rare JE cases near waterlogged underpass.' },
  { id: 'd10', lat: 28.578, lng: 77.233, disease: 'Influenza', severity: 'self-care', cases: 65, street: 'Lodhi Rd, Jor Bagh', city: 'Delhi', state: 'Delhi', lastReported: '2026-03-02', description: 'Seasonal flu in diplomatic enclave area.' },

  // ─── KOLKATA ───
  { id: 'k1', lat: 22.5726, lng: 88.3639, disease: 'Dengue Fever', severity: 'doctor', cases: 175, street: 'Park Street, Mullick Bazaar', city: 'Kolkata', state: 'West Bengal', lastReported: '2026-03-04', description: 'Dengue spreading through clogged street drains.' },
  { id: 'k2', lat: 22.5448, lng: 88.3426, disease: 'Cholera', severity: 'emergency', cases: 60, street: 'Garden Reach Rd, Kidderpore', city: 'Kolkata', state: 'West Bengal', lastReported: '2026-03-02', description: 'Cholera outbreak near docks with contaminated supply.' },
  { id: 'k3', lat: 22.6033, lng: 88.3953, disease: 'Hepatitis A', severity: 'doctor', cases: 22, street: 'Broadway, Salt Lake Sector V', city: 'Kolkata', state: 'West Bengal', lastReported: '2026-02-20', description: 'Hepatitis from unhygienic food carts near IT park.' },
  { id: 'k4', lat: 22.565, lng: 88.345, disease: 'Malaria', severity: 'doctor', cases: 68, street: 'Strand Road, Howrah Bridge', city: 'Kolkata', state: 'West Bengal', lastReported: '2026-03-03', description: 'Malaria cluster along Hooghly riverbank settlements.' },
  { id: 'k5', lat: 22.515, lng: 88.365, disease: 'Typhoid', severity: 'doctor', cases: 31, street: 'Diamond Harbour Rd, Behala', city: 'Kolkata', state: 'West Bengal', lastReported: '2026-02-25', description: 'Typhoid cases from rusty pipe supply in old colony.' },
  { id: 'k6', lat: 22.589, lng: 88.4, disease: 'Dengue Fever', severity: 'doctor', cases: 44, street: 'EM Bypass, Kasba', city: 'Kolkata', state: 'West Bengal', lastReported: '2026-02-18', description: 'Moderate dengue near marshy wasteland.' },
  { id: 'k7', lat: 22.63, lng: 88.38, disease: 'Tuberculosis', severity: 'doctor', cases: 39, street: 'BT Road, Dunlop', city: 'Kolkata', state: 'West Bengal', lastReported: '2026-02-28', description: 'TB in factory worker slum near jute mills.' },

  // ─── CHENNAI ───
  { id: 'c1', lat: 13.0827, lng: 80.2707, disease: 'Dengue Fever', severity: 'doctor', cases: 140, street: 'Anna Salai, Mount Road', city: 'Chennai', state: 'Tamil Nadu', lastReported: '2026-03-03', description: 'Post-rain dengue spike in central business district.' },
  { id: 'c2', lat: 13.0569, lng: 80.2425, disease: 'Typhoid', severity: 'doctor', cases: 35, street: 'Kutchery Rd, Mylapore', city: 'Chennai', state: 'Tamil Nadu', lastReported: '2026-02-28', description: 'Typhoid from old bore wells near temple tanks.' },
  { id: 'c3', lat: 13.1067, lng: 80.2847, disease: 'Leptospirosis', severity: 'doctor', cases: 48, street: 'TH Road, Tondiarpet', city: 'Chennai', state: 'Tamil Nadu', lastReported: '2026-03-01', description: 'Leptospirosis after severe waterlogging in north Chennai.' },
  { id: 'c4', lat: 13.004, lng: 80.255, disease: 'Chikungunya', severity: 'doctor', cases: 37, street: 'Rajiv Gandhi Salai, Thoraipakkam', city: 'Chennai', state: 'Tamil Nadu', lastReported: '2026-02-22', description: 'Chikungunya near IT corridor construction zones.' },
  { id: 'c5', lat: 13.065, lng: 80.285, disease: 'Cholera', severity: 'doctor', cases: 25, street: 'Pycrofts Rd, Triplicane', city: 'Chennai', state: 'Tamil Nadu', lastReported: '2026-03-04', description: 'Cholera from sewage overflow into drinking water.' },
  { id: 'c6', lat: 13.12, lng: 80.23, disease: 'Malaria', severity: 'self-care', cases: 12, street: 'Poonamallee High Rd, Kilpauk', city: 'Chennai', state: 'Tamil Nadu', lastReported: '2026-02-10', description: 'Sporadic malaria near canal bank.' },
  { id: 'c7', lat: 13.04, lng: 80.27, disease: 'Influenza', severity: 'self-care', cases: 55, street: 'Cathedral Rd, Gopalapuram', city: 'Chennai', state: 'Tamil Nadu', lastReported: '2026-03-02', description: 'Seasonal flu wave in residential locality.' },

  // ─── BENGALURU ───
  { id: 'b1', lat: 12.9716, lng: 77.5946, disease: 'Dengue Fever', severity: 'doctor', cases: 55, street: 'MG Road, Brigade Junction', city: 'Bengaluru', state: 'Karnataka', lastReported: '2026-02-25', description: 'Moderate dengue in commercial hub.' },
  { id: 'b2', lat: 12.9352, lng: 77.6245, disease: 'Chikungunya', severity: 'doctor', cases: 72, street: '80 Feet Rd, Koramangala 4th Block', city: 'Bengaluru', state: 'Karnataka', lastReported: '2026-03-04', description: 'Chikungunya cluster in residential layout with open plots.' },
  { id: 'b3', lat: 13.0358, lng: 77.597, disease: 'Tuberculosis', severity: 'doctor', cases: 18, street: 'Tumkur Rd, Yeshwanthpur', city: 'Bengaluru', state: 'Karnataka', lastReported: '2026-02-15', description: 'TB among industrial workers in garment district.' },
  { id: 'b4', lat: 12.906, lng: 77.585, disease: 'Dengue Fever', severity: 'doctor', cases: 88, street: 'Bannerghatta Rd, BTM Layout', city: 'Bengaluru', state: 'Karnataka', lastReported: '2026-03-03', description: 'Dengue outbreak near overflowing storm drains.' },
  { id: 'b5', lat: 12.98, lng: 77.64, disease: 'Hepatitis A', severity: 'self-care', cases: 9, street: 'Old Airport Rd, Indiranagar', city: 'Bengaluru', state: 'Karnataka', lastReported: '2026-02-08', description: 'Isolated hepatitis case from contaminated juice stall.' },
  { id: 'b6', lat: 13.015, lng: 77.555, disease: 'Malaria', severity: 'doctor', cases: 26, street: 'Rajajinagar Main Rd', city: 'Bengaluru', state: 'Karnataka', lastReported: '2026-02-20', description: 'Malaria near lake bed with standing water.' },
  { id: 'b7', lat: 12.955, lng: 77.7, disease: 'Leptospirosis', severity: 'self-care', cases: 7, street: 'Whitefield Main Rd, ITPL', city: 'Bengaluru', state: 'Karnataka', lastReported: '2026-02-05', description: 'Rare leptospirosis after heavy downpour.' },

  // ─── HYDERABAD ───
  { id: 'h1', lat: 17.385, lng: 78.4867, disease: 'Malaria', severity: 'doctor', cases: 88, street: 'Laad Bazaar, Charminar', city: 'Hyderabad', state: 'Telangana', lastReported: '2026-03-03', description: 'Malaria in old city with poor drainage infrastructure.' },
  { id: 'h2', lat: 17.44, lng: 78.3489, disease: 'Dengue Fever', severity: 'doctor', cases: 40, street: 'Madhapur Main Rd, HITEC City', city: 'Hyderabad', state: 'Telangana', lastReported: '2026-02-27', description: 'Dengue near active construction zones in IT corridor.' },
  { id: 'h3', lat: 17.36, lng: 78.47, disease: 'Cholera', severity: 'doctor', cases: 34, street: 'Falaknuma Rd, Old City', city: 'Hyderabad', state: 'Telangana', lastReported: '2026-03-01', description: 'Cholera from open sewage mixing with drinking water.' },
  { id: 'h4', lat: 17.42, lng: 78.45, disease: 'Typhoid', severity: 'doctor', cases: 21, street: 'Abids Rd, Koti', city: 'Hyderabad', state: 'Telangana', lastReported: '2026-02-22', description: 'Typhoid cases traced to street water vendors.' },
  { id: 'h5', lat: 17.46, lng: 78.39, disease: 'Chikungunya', severity: 'doctor', cases: 56, street: 'Kukatpally Main Rd', city: 'Hyderabad', state: 'Telangana', lastReported: '2026-03-04', description: 'Chikungunya in rapidly growing suburban colony.' },
  { id: 'h6', lat: 17.395, lng: 78.53, disease: 'Tuberculosis', severity: 'doctor', cases: 15, street: 'Uppal Rd, LB Nagar', city: 'Hyderabad', state: 'Telangana', lastReported: '2026-02-18', description: 'TB cluster in migrant labour camp.' },

  // ─── PUNE ───
  { id: 'p1', lat: 18.5204, lng: 73.8567, disease: 'Dengue Fever', severity: 'doctor', cases: 110, street: 'FC Road, Deccan Gymkhana', city: 'Pune', state: 'Maharashtra', lastReported: '2026-03-02', description: 'Dengue surge around university hostels.' },
  { id: 'p2', lat: 18.4904, lng: 73.8143, disease: 'Hepatitis A', severity: 'self-care', cases: 8, street: 'Sinhagad Rd, Vadgaon', city: 'Pune', state: 'Maharashtra', lastReported: '2026-02-12', description: 'Isolated hepatitis from contaminated canteen food.' },
  { id: 'p3', lat: 18.55, lng: 73.9, disease: 'Malaria', severity: 'doctor', cases: 45, street: 'Nagar Rd, Viman Nagar', city: 'Pune', state: 'Maharashtra', lastReported: '2026-02-28', description: 'Malaria near Mula-Mutha river bank.' },
  { id: 'p4', lat: 18.505, lng: 73.87, disease: 'Chikungunya', severity: 'doctor', cases: 27, street: 'Laxmi Rd, Sadashiv Peth', city: 'Pune', state: 'Maharashtra', lastReported: '2026-02-20', description: 'Chikungunya in old peth area with narrow lanes.' },
  { id: 'p5', lat: 18.56, lng: 73.78, disease: 'Leptospirosis', severity: 'doctor', cases: 32, street: 'Paud Rd, Kothrud', city: 'Pune', state: 'Maharashtra', lastReported: '2026-03-01', description: 'Lepto cases after flash flooding near hillside.' },

  // ─── AHMEDABAD ───
  { id: 'a1', lat: 23.0225, lng: 72.5714, disease: 'Cholera', severity: 'doctor', cases: 52, street: 'Ashram Rd, Navrangpura', city: 'Ahmedabad', state: 'Gujarat', lastReported: '2026-03-01', description: 'Cholera linked to polluted Sabarmati river water usage.' },
  { id: 'a2', lat: 23.0469, lng: 72.5317, disease: 'Malaria', severity: 'doctor', cases: 30, street: 'SG Highway, Bodakdev', city: 'Ahmedabad', state: 'Gujarat', lastReported: '2026-02-22', description: 'Malaria in rapidly developing western corridor.' },
  { id: 'a3', lat: 23.003, lng: 72.585, disease: 'Dengue Fever', severity: 'doctor', cases: 74, street: 'Relief Rd, Kalupur', city: 'Ahmedabad', state: 'Gujarat', lastReported: '2026-03-04', description: 'Dengue outbreak in walled city market area.' },
  { id: 'a4', lat: 23.06, lng: 72.55, disease: 'Typhoid', severity: 'doctor', cases: 18, street: 'CG Road, Paldi', city: 'Ahmedabad', state: 'Gujarat', lastReported: '2026-02-16', description: 'Typhoid from contaminated street water tankers.' },

  // ─── LUCKNOW ───
  { id: 'l1', lat: 26.8467, lng: 80.9462, disease: 'Dengue Fever', severity: 'emergency', cases: 195, street: 'Hazratganj Market', city: 'Lucknow', state: 'Uttar Pradesh', lastReported: '2026-03-05', description: 'Critical dengue outbreak in central market district.' },
  { id: 'l2', lat: 26.87, lng: 80.98, disease: 'Typhoid', severity: 'doctor', cases: 44, street: 'Aminabad Main Rd', city: 'Lucknow', state: 'Uttar Pradesh', lastReported: '2026-02-28', description: 'Typhoid from corroded pipeline in old bazaar.' },
  { id: 'l3', lat: 26.82, lng: 80.91, disease: 'Japanese Encephalitis', severity: 'emergency', cases: 28, street: 'Sitapur Rd, Aliganj', city: 'Lucknow', state: 'Uttar Pradesh', lastReported: '2026-03-03', description: 'JE cases near waterlogged paddy fields on city outskirts.' },
  { id: 'l4', lat: 26.86, lng: 80.95, disease: 'Cholera', severity: 'doctor', cases: 16, street: 'Chowk, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', lastReported: '2026-02-20', description: 'Cholera in dense old-city neighbourhood.' },

  // ─── JAIPUR ───
  { id: 'j1', lat: 26.9124, lng: 75.7873, disease: 'Chikungunya', severity: 'doctor', cases: 33, street: 'MI Road, C-Scheme', city: 'Jaipur', state: 'Rajasthan', lastReported: '2026-02-20', description: 'Chikungunya cases in walled city heritage zone.' },
  { id: 'j2', lat: 26.8851, lng: 75.8105, disease: 'Dengue Fever', severity: 'doctor', cases: 78, street: 'Tonk Rd, Durgapura', city: 'Jaipur', state: 'Rajasthan', lastReported: '2026-03-02', description: 'Dengue spreading through residential colonies.' },
  { id: 'j3', lat: 26.94, lng: 75.76, disease: 'Malaria', severity: 'doctor', cases: 22, street: 'Amer Rd, Jal Mahal', city: 'Jaipur', state: 'Rajasthan', lastReported: '2026-02-18', description: 'Malaria near stagnant lake water.' },
  { id: 'j4', lat: 26.9, lng: 75.82, disease: 'Typhoid', severity: 'self-care', cases: 10, street: 'Station Rd, Sindhi Camp', city: 'Jaipur', state: 'Rajasthan', lastReported: '2026-02-10', description: 'Typhoid from unhygienic food near bus station.' },

  // ─── PATNA ───
  { id: 'pa1', lat: 25.6093, lng: 85.1376, disease: 'Japanese Encephalitis', severity: 'emergency', cases: 75, street: 'Ashok Rajpath', city: 'Patna', state: 'Bihar', lastReported: '2026-03-05', description: 'JE epidemic near Ganga flood zone.' },
  { id: 'pa2', lat: 25.62, lng: 85.12, disease: 'Cholera', severity: 'doctor', cases: 42, street: 'Boring Rd', city: 'Patna', state: 'Bihar', lastReported: '2026-03-03', description: 'Cholera from open sewer contamination.' },
  { id: 'pa3', lat: 25.59, lng: 85.15, disease: 'Dengue Fever', severity: 'doctor', cases: 98, street: 'Kankarbagh Main Rd', city: 'Patna', state: 'Bihar', lastReported: '2026-03-04', description: 'Dengue surge in waterlogged residential area.' },
  { id: 'pa4', lat: 25.63, lng: 85.1, disease: 'Malaria', severity: 'doctor', cases: 55, street: 'Bailey Rd, Rajbansi Nagar', city: 'Patna', state: 'Bihar', lastReported: '2026-02-28', description: 'Malaria cases near Gandak river overflow.' },

  // ─── BHOPAL ───
  { id: 'bh1', lat: 23.2599, lng: 77.4126, disease: 'Dengue Fever', severity: 'doctor', cases: 62, street: 'MP Nagar Zone-I', city: 'Bhopal', state: 'Madhya Pradesh', lastReported: '2026-03-02', description: 'Dengue near artificial lakes with poor maintenance.' },
  { id: 'bh2', lat: 23.27, lng: 77.43, disease: 'Malaria', severity: 'doctor', cases: 28, street: 'Hamidia Rd, Old City', city: 'Bhopal', state: 'Madhya Pradesh', lastReported: '2026-02-25', description: 'Malaria in dense old-city settlement.' },
  { id: 'bh3', lat: 23.24, lng: 77.4, disease: 'Tuberculosis', severity: 'doctor', cases: 35, street: 'Kolar Rd, Shivaji Nagar', city: 'Bhopal', state: 'Madhya Pradesh', lastReported: '2026-02-20', description: 'TB outbreak in industrial workers colony.' },

  // ─── KOCHI ───
  { id: 'ko1', lat: 9.9312, lng: 76.2673, disease: 'Leptospirosis', severity: 'emergency', cases: 56, street: 'MG Road, Ernakulam', city: 'Kochi', state: 'Kerala', lastReported: '2026-03-04', description: 'Post-flood leptospirosis surge in port area.' },
  { id: 'ko2', lat: 9.96, lng: 76.29, disease: 'Dengue Fever', severity: 'doctor', cases: 48, street: 'Edappally Junction', city: 'Kochi', state: 'Kerala', lastReported: '2026-03-03', description: 'Dengue near backwater canal system.' },
  { id: 'ko3', lat: 9.95, lng: 76.26, disease: 'Hepatitis A', severity: 'doctor', cases: 19, street: 'Market Rd, Fort Kochi', city: 'Kochi', state: 'Kerala', lastReported: '2026-02-22', description: 'Hepatitis linked to contaminated seafood vendors.' },

  // ─── GUWAHATI ───
  { id: 'g1', lat: 26.1445, lng: 91.7362, disease: 'Japanese Encephalitis', severity: 'emergency', cases: 45, street: 'GS Road, Dispur', city: 'Guwahati', state: 'Assam', lastReported: '2026-03-05', description: 'JE outbreak near Brahmaputra flood-affected areas.' },
  { id: 'g2', lat: 26.16, lng: 91.75, disease: 'Malaria', severity: 'doctor', cases: 72, street: 'AT Road, Fancy Bazaar', city: 'Guwahati', state: 'Assam', lastReported: '2026-03-04', description: 'Malaria endemic zone with seasonal surge.' },
  { id: 'g3', lat: 26.13, lng: 91.72, disease: 'Dengue Fever', severity: 'doctor', cases: 34, street: 'Zoo Rd, Hengrabari', city: 'Guwahati', state: 'Assam', lastReported: '2026-02-28', description: 'Dengue near hillside settlements with poor drainage.' },

  // ─── VARANASI ───
  { id: 'v1', lat: 25.3176, lng: 82.9739, disease: 'Cholera', severity: 'emergency', cases: 38, street: 'Dashashwamedh Ghat Rd', city: 'Varanasi', state: 'Uttar Pradesh', lastReported: '2026-03-04', description: 'Cholera from Ganga ghats contaminated water usage.' },
  { id: 'v2', lat: 25.33, lng: 82.99, disease: 'Typhoid', severity: 'doctor', cases: 29, street: 'Lanka, BHU Gate', city: 'Varanasi', state: 'Uttar Pradesh', lastReported: '2026-03-01', description: 'Typhoid in university neighbourhood from old pipes.' },
  { id: 'v3', lat: 25.3, lng: 82.96, disease: 'Hepatitis A', severity: 'doctor', cases: 17, street: 'Godowlia Chowk', city: 'Varanasi', state: 'Uttar Pradesh', lastReported: '2026-02-22', description: 'Hepatitis near street food hub in old city market.' },

  // ─── INDORE ───
  { id: 'in1', lat: 22.7196, lng: 75.8577, disease: 'Dengue Fever', severity: 'doctor', cases: 36, street: 'MG Road, Palasia', city: 'Indore', state: 'Madhya Pradesh', lastReported: '2026-02-28', description: 'Moderate dengue near commercial centre.' },
  { id: 'in2', lat: 22.74, lng: 75.88, disease: 'Chikungunya', severity: 'doctor', cases: 41, street: 'AB Road, Vijay Nagar', city: 'Indore', state: 'Madhya Pradesh', lastReported: '2026-03-03', description: 'Chikungunya spread through suburban residential area.' },

  // ─── CHANDIGARH ───
  { id: 'ch1', lat: 30.7333, lng: 76.7794, disease: 'Influenza', severity: 'doctor', cases: 78, street: 'Sector 17 Market', city: 'Chandigarh', state: 'Chandigarh', lastReported: '2026-03-02', description: 'Seasonal influenza wave in commercial sector.' },
  { id: 'ch2', lat: 30.71, lng: 76.77, disease: 'Dengue Fever', severity: 'doctor', cases: 52, street: 'Sector 22, Main Market', city: 'Chandigarh', state: 'Chandigarh', lastReported: '2026-03-04', description: 'Dengue near construction debris along sector roads.' },
  { id: 'ch3', lat: 30.74, lng: 76.79, disease: 'Typhoid', severity: 'self-care', cases: 14, street: 'Sector 35, Market', city: 'Chandigarh', state: 'Chandigarh', lastReported: '2026-02-18', description: 'Isolated typhoid cases from water cooler contamination.' },

  // ─── CHHATTISGARH ───
  { id: 'cg1', lat: 21.2514, lng: 81.6296, disease: 'Malaria', severity: 'emergency', cases: 145, street: 'Civil Lines, Ring Rd No. 1', city: 'Raipur', state: 'Chhattisgarh', lastReported: '2026-03-05', description: 'Severe malaria outbreak in tribal belt adjacent to urban area.' },
  { id: 'cg2', lat: 21.23, lng: 81.65, disease: 'Dengue Fever', severity: 'doctor', cases: 68, street: 'Pandri Market Rd', city: 'Raipur', state: 'Chhattisgarh', lastReported: '2026-03-03', description: 'Dengue spread through monsoon water accumulation zones.' },
  { id: 'cg3', lat: 21.27, lng: 81.61, disease: 'Typhoid', severity: 'doctor', cases: 31, street: 'Shankar Nagar Main Rd', city: 'Raipur', state: 'Chhattisgarh', lastReported: '2026-02-26', description: 'Typhoid from contaminated hand pumps in old neighborhoods.' },
  { id: 'cg4', lat: 22.09, lng: 82.14, disease: 'Japanese Encephalitis', severity: 'doctor', cases: 42, street: 'Station Rd', city: 'Bilaspur', state: 'Chhattisgarh', lastReported: '2026-03-02', description: 'JE cases near paddy cultivation areas.' },

  // ─── GOA ───
  { id: 'go1', lat: 15.2993, lng: 74.124, disease: 'Leptospirosis', severity: 'doctor', cases: 38, street: 'Panaji Market, 18th June Rd', city: 'Panaji', state: 'Goa', lastReported: '2026-03-04', description: 'Monsoon-related leptospirosis near Mandovi river banks.' },
  { id: 'go2', lat: 15.55, lng: 73.76, disease: 'Dengue Fever', severity: 'doctor', cases: 29, street: 'Calangute Beach Rd', city: 'Calangute', state: 'Goa', lastReported: '2026-02-28', description: 'Tourist area dengue cluster from standing water in resorts.' },
  { id: 'go3', lat: 15.28, lng: 73.97, disease: 'Hepatitis A', severity: 'doctor', cases: 22, street: 'Margao Market Complex', city: 'Margao', state: 'Goa', lastReported: '2026-02-22', description: 'Hepatitis traced to seafood market hygiene issues.' },
  { id: 'go4', lat: 15.48, lng: 73.83, disease: 'Typhoid', severity: 'self-care', cases: 11, street: 'Mapusa Municipal Market', city: 'Mapusa', state: 'Goa', lastReported: '2026-02-15', description: 'Sporadic typhoid from contaminated ice in beverages.' },

  // ─── HARYANA ───
  { id: 'hr1', lat: 28.4595, lng: 77.0266, disease: 'Dengue Fever', severity: 'emergency', cases: 188, street: 'MG Road, Sector 14', city: 'Gurugram', state: 'Haryana', lastReported: '2026-03-05', description: 'Major dengue outbreak in high-rise residential complexes.' },
  { id: 'hr2', lat: 28.42, lng: 77.05, disease: 'Chikungunya', severity: 'doctor', cases: 76, street: 'Golf Course Rd, DLF Phase-2', city: 'Gurugram', state: 'Haryana', lastReported: '2026-03-03', description: 'Chikungunya in corporate office belt with construction sites.' },
  { id: 'hr3', lat: 29.1492, lng: 75.7217, disease: 'Typhoid', severity: 'doctor', cases: 35, street: 'Model Town, Railway Rd', city: 'Hisar', state: 'Haryana', lastReported: '2026-02-26', description: 'Typhoid outbreak from contaminated bore water supply.' },
  { id: 'hr4', lat: 29.5857, lng: 76.6173, disease: 'Malaria', severity: 'doctor', cases: 28, street: 'Pipli Mandi Rd', city: 'Panipat', state: 'Haryana', lastReported: '2026-02-20', description: 'Malaria near canal irrigation zones.' },
  { id: 'hr5', lat: 28.87, lng: 76.58, disease: 'Influenza', severity: 'self-care', cases: 62, street: 'Sector 17, Main Market', city: 'Faridabad', state: 'Haryana', lastReported: '2026-03-01', description: 'Seasonal flu in industrial township.' },

  // ─── HIMACHAL PRADESH ───
  { id: 'hp1', lat: 31.1048, lng: 77.1734, disease: 'Influenza', severity: 'doctor', cases: 92, street: 'The Mall Road', city: 'Shimla', state: 'Himachal Pradesh', lastReported: '2026-03-04', description: 'Winter flu epidemic in tourist hill station.' },
  { id: 'hp2', lat: 32.2432, lng: 76.3229, disease: 'Typhoid', severity: 'doctor', cases: 24, street: 'Lower Dharamshala Rd', city: 'Dharamshala', state: 'Himachal Pradesh', lastReported: '2026-02-25', description: 'Typhoid from mountain spring water contamination.' },
  { id: 'hp3', lat: 31.1, lng: 77.18, disease: 'Tuberculosis', severity: 'doctor', cases: 18, street: 'Sanjauli Bazaar', city: 'Shimla', state: 'Himachal Pradesh', lastReported: '2026-02-18', description: 'TB cases in crowded hillside settlements.' },
  { id: 'hp4', lat: 32.08, lng: 76.53, disease: 'Hepatitis A', severity: 'self-care', cases: 13, street: 'Palampur Market Rd', city: 'Palampur', state: 'Himachal Pradesh', lastReported: '2026-02-12', description: 'Isolated hepatitis from roadside eateries.' },

  // ─── JAMMU & KASHMIR ───
  { id: 'jk1', lat: 34.0837, lng: 74.7973, disease: 'Typhoid', severity: 'doctor', cases: 54, street: 'Lal Chowk, Residency Rd', city: 'Srinagar', state: 'Jammu & Kashmir', lastReported: '2026-03-03', description: 'Typhoid outbreak from aged water distribution system.' },
  { id: 'jk2', lat: 32.7266, lng: 74.857, disease: 'Influenza', severity: 'doctor', cases: 71, street: 'Gandhi Nagar Market', city: 'Jammu', state: 'Jammu & Kashmir', lastReported: '2026-03-01', description: 'Seasonal flu in dense urban market area.' },
  { id: 'jk3', lat: 34.15, lng: 74.83, disease: 'Tuberculosis', severity: 'doctor', cases: 38, street: 'Soura, Airport Rd', city: 'Srinagar', state: 'Jammu & Kashmir', lastReported: '2026-02-28', description: 'TB cluster in congested residential colony.' },
  { id: 'jk4', lat: 32.68, lng: 74.88, disease: 'Hepatitis A', severity: 'self-care', cases: 16, street: 'Raghunath Bazaar', city: 'Jammu', state: 'Jammu & Kashmir', lastReported: '2026-02-20', description: 'Hepatitis from street food vendors near temple.' },

  // ─── JHARKHAND ───
  { id: 'jh1', lat: 23.3441, lng: 85.3096, disease: 'Malaria', severity: 'emergency', cases: 168, street: 'Main Rd, Doranda', city: 'Ranchi', state: 'Jharkhand', lastReported: '2026-03-05', description: 'Severe malaria in mining belt with stagnant water bodies.' },
  { id: 'jh2', lat: 23.36, lng: 85.33, disease: 'Japanese Encephalitis', severity: 'doctor', cases: 47, street: 'Kanke Rd, Ashok Nagar', city: 'Ranchi', state: 'Jharkhand', lastReported: '2026-03-04', description: 'JE outbreak near agricultural outskirts.' },
  { id: 'jh3', lat: 22.8046, lng: 86.2029, disease: 'Dengue Fever', severity: 'doctor', cases: 82, street: 'Bistupur Market Rd', city: 'Jamshedpur', state: 'Jharkhand', lastReported: '2026-03-02', description: 'Industrial city dengue spike from poor drainage.' },
  { id: 'jh4', lat: 23.67, lng: 86.15, disease: 'Cholera', severity: 'doctor', cases: 34, street: 'Bank More', city: 'Dhanbad', state: 'Jharkhand', lastReported: '2026-02-26', description: 'Cholera in coal mining town from contaminated supply.' },
  { id: 'jh5', lat: 23.38, lng: 85.28, disease: 'Tuberculosis', severity: 'doctor', cases: 29, street: 'Lalpur Chowk', city: 'Ranchi', state: 'Jharkhand', lastReported: '2026-02-22', description: 'TB among industrial migrant workers.' },

  // ─── MANIPUR ───
  { id: 'mn1', lat: 24.8170, lng: 93.9368, disease: 'Japanese Encephalitis', severity: 'doctor', cases: 36, street: 'Thangal Bazaar', city: 'Imphal', state: 'Manipur', lastReported: '2026-03-03', description: 'JE cases near flooded paddy fields in valley.' },
  { id: 'mn2', lat: 24.79, lng: 93.95, disease: 'Malaria', severity: 'doctor', cases: 28, street: 'Paona Bazaar Rd', city: 'Imphal', state: 'Manipur', lastReported: '2026-02-28', description: 'Malaria endemic in hill-valley transition zone.' },
  { id: 'mn3', lat: 24.83, lng: 93.91, disease: 'Dengue Fever', severity: 'doctor', cases: 31, street: 'Uripok Market', city: 'Imphal', state: 'Manipur', lastReported: '2026-02-24', description: 'Dengue spread through monsoon water collection.' },

  // ─── MEGHALAYA ───
  { id: 'mg1', lat: 25.5788, lng: 91.8933, disease: 'Tuberculosis', severity: 'doctor', cases: 44, street: 'Police Bazaar', city: 'Shillong', state: 'Meghalaya', lastReported: '2026-03-04', description: 'TB in high-altitude congested market area.' },
  { id: 'mg2', lat: 25.56, lng: 91.88, disease: 'Typhoid', severity: 'doctor', cases: 27, street: 'Laitumkhrah Main Rd', city: 'Shillong', state: 'Meghalaya', lastReported: '2026-02-26', description: 'Typhoid from contaminated hill spring sources.' },
  { id: 'mg3', lat: 25.6, lng: 91.91, disease: 'Influenza', severity: 'doctor', cases: 58, street: 'Mawlai Market', city: 'Shillong', state: 'Meghalaya', lastReported: '2026-03-01', description: 'Cold weather flu in hill station residential zones.' },

  // ─── MIZORAM ───
  { id: 'mz1', lat: 23.7271, lng: 92.7176, disease: 'Malaria', severity: 'emergency', cases: 94, street: 'Zarkawt, Main Market', city: 'Aizawl', state: 'Mizoram', lastReported: '2026-03-05', description: 'Severe malaria in hilly forested border region.' },
  { id: 'mz2', lat: 23.73, lng: 92.72, disease: 'Dengue Fever', severity: 'doctor', cases: 47, street: 'Bara Bazaar', city: 'Aizawl', state: 'Mizoram', lastReported: '2026-03-03', description: 'Dengue in densely built hillside settlements.' },
  { id: 'mz3', lat: 23.71, lng: 92.71, disease: 'Typhoid', severity: 'doctor', cases: 22, street: 'Thuampui Rd', city: 'Aizawl', state: 'Mizoram', lastReported: '2026-02-25', description: 'Typhoid from water storage contamination in hills.' },

  // ─── NAGALAND ───
  { id: 'ng1', lat: 25.6747, lng: 94.1075, disease: 'Malaria', severity: 'doctor', cases: 61, street: 'NST Market, New Secretariat', city: 'Kohima', state: 'Nagaland', lastReported: '2026-03-04', description: 'Malaria in hilly terrain with poor healthcare access.' },
  { id: 'ng2', lat: 26.1584, lng: 94.5624, disease: 'Japanese Encephalitis', severity: 'doctor', cases: 19, street: 'Hong Kong Market', city: 'Dimapur', state: 'Nagaland', lastReported: '2026-02-28', description: 'JE near rice cultivation valleys.' },
  { id: 'ng3', lat: 25.67, lng: 94.12, disease: 'Tuberculosis', severity: 'doctor', cases: 23, street: 'PR Hill Rd', city: 'Kohima', state: 'Nagaland', lastReported: '2026-02-22', description: 'TB in remote mountainous settlements.' },

  // ─── ODISHA ───
  { id: 'od1', lat: 20.2961, lng: 85.8245, disease: 'Cholera', severity: 'emergency', cases: 87, street: 'Bhubaneswar Railway Station Rd', city: 'Bhubaneswar', state: 'Odisha', lastReported: '2026-03-05', description: 'Cholera outbreak from cyclone-affected water supply.' },
  { id: 'od2', lat: 20.25, lng: 85.84, disease: 'Dengue Fever', severity: 'doctor', cases: 96, street: 'Kharavel Nagar, Unit-3', city: 'Bhubaneswar', state: 'Odisha', lastReported: '2026-03-04', description: 'Post-storm dengue surge in capital city.' },
  { id: 'od3', lat: 20.47, lng: 85.89, disease: 'Malaria', severity: 'doctor', cases: 73, street: 'Badambadi, Bus Stand Rd', city: 'Cuttack', state: 'Odisha', lastReported: '2026-03-02', description: 'Malaria along Mahanadi river flood plains.' },
  { id: 'od4', lat: 21.21, lng: 86.85, disease: 'Japanese Encephalitis', severity: 'doctor', cases: 31, street: 'Balasore Main Rd', city: 'Balasore', state: 'Odisha', lastReported: '2026-02-26', description: 'JE in coastal agricultural belt.' },
  { id: 'od5', lat: 20.3, lng: 85.82, disease: 'Leptospirosis', severity: 'doctor', cases: 52, street: 'Nayapalli, Janpath', city: 'Bhubaneswar', state: 'Odisha', lastReported: '2026-03-03', description: 'Flooding-related lepto in urban waterlogged zones.' },

  // ─── PUNJAB ───
  { id: 'pb1', lat: 31.6340, lng: 74.8723, disease: 'Dengue Fever', severity: 'emergency', cases: 215, street: 'Mall Road, Lawrence Rd', city: 'Amritsar', state: 'Punjab', lastReported: '2026-03-05', description: 'Major dengue epidemic in heritage city.' },
  { id: 'pb2', lat: 30.9010, lng: 75.8573, disease: 'Chikungunya', severity: 'doctor', cases: 89, street: 'Model Town, Ferozepur Rd', city: 'Ludhiana', state: 'Punjab', lastReported: '2026-03-04', description: 'Chikungunya in industrial hub with poor sanitation.' },
  { id: 'pb3', lat: 30.71, lng: 76.71, disease: 'Typhoid', severity: 'doctor', cases: 43, street: 'Sirhind Canal Rd', city: 'Patiala', state: 'Punjab', lastReported: '2026-02-28', description: 'Typhoid from agricultural runoff in canal water.' },
  { id: 'pb4', lat: 31.32, lng: 75.58, disease: 'Malaria', severity: 'doctor', cases: 37, street: 'GT Road, Jalandhar City', city: 'Jalandhar', state: 'Punjab', lastReported: '2026-02-24', description: 'Malaria near irrigation water channels.' },
  { id: 'pb5', lat: 31.63, lng: 74.86, disease: 'Hepatitis A', severity: 'self-care', cases: 18, street: 'Hall Bazaar', city: 'Amritsar', state: 'Punjab', lastReported: '2026-02-18', description: 'Hepatitis from street food near Golden Temple.' },

  // ─── SIKKIM ───
  { id: 'sk1', lat: 27.3389, lng: 88.6065, disease: 'Influenza', severity: 'doctor', cases: 67, street: 'MG Marg', city: 'Gangtok', state: 'Sikkim', lastReported: '2026-03-04', description: 'High-altitude flu in tourist season peak.' },
  { id: 'sk2', lat: 27.33, lng: 88.62, disease: 'Tuberculosis', severity: 'doctor', cases: 21, street: 'Deorali Bazaar', city: 'Gangtok', state: 'Sikkim', lastReported: '2026-02-26', description: 'TB in congested hillside market settlements.' },
  { id: 'sk3', lat: 27.32, lng: 88.59, disease: 'Typhoid', severity: 'self-care', cases: 12, street: 'Ranipool Market Rd', city: 'Gangtok', state: 'Sikkim', lastReported: '2026-02-15', description: 'Sporadic typhoid from mountain water sources.' },

  // ─── TRIPURA ───
  { id: 'tr1', lat: 23.8315, lng: 91.2868, disease: 'Malaria', severity: 'emergency', cases: 102, street: 'Agartala-Khowai Rd, Pratapgarh', city: 'Agartala', state: 'Tripura', lastReported: '2026-03-05', description: 'Critical malaria in border forest fringe areas.' },
  { id: 'tr2', lat: 23.84, lng: 91.27, disease: 'Dengue Fever', severity: 'doctor', cases: 58, street: 'Palace Compound Rd', city: 'Agartala', state: 'Tripura', lastReported: '2026-03-03', description: 'Dengue near palace lake water bodies.' },
  { id: 'tr3', lat: 23.83, lng: 91.28, disease: 'Typhoid', severity: 'doctor', cases: 26, street: 'Battala Market', city: 'Agartala', state: 'Tripura', lastReported: '2026-02-27', description: 'Typhoid from contaminated tube wells in old city.' },
  { id: 'tr4', lat: 23.85, lng: 91.29, disease: 'Japanese Encephalitis', severity: 'doctor', cases: 17, street: 'GB Hospital Rd', city: 'Agartala', state: 'Tripura', lastReported: '2026-02-22', description: 'JE near paddy fields in urban periphery.' },

  // ─── UTTARAKHAND ───
  { id: 'uk1', lat: 30.0668, lng: 79.0193, disease: 'Typhoid', severity: 'doctor', cases: 64, street: 'Rajpur Rd, Hathibarkala', city: 'Dehradun', state: 'Uttarakhand', lastReported: '2026-03-04', description: 'Typhoid from contaminated Rispana river water usage.' },
  { id: 'uk2', lat: 29.3803, lng: 79.4636, disease: 'Influenza', severity: 'doctor', cases: 82, street: 'Haldwani Rd, Tallital', city: 'Nainital', state: 'Uttarakhand', lastReported: '2026-03-02', description: 'Tourist season flu epidemic in lake town.' },
  { id: 'uk3', lat: 30.09, lng: 78.28, disease: 'Hepatitis A', severity: 'doctor', cases: 29, street: 'Ram Bazaar, Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', lastReported: '2026-02-26', description: 'Hepatitis near Ganga bathing ghats and ashrams.' },
  { id: 'uk4', lat: 30.07, lng: 79.03, disease: 'Tuberculosis', severity: 'doctor', cases: 24, street: 'Clement Town, Rajpur', city: 'Dehradun', state: 'Uttarakhand', lastReported: '2026-02-20', description: 'TB cluster in valley settlements with poor ventilation.' },

  // ─── ANDAMAN & NICOBAR ISLAND ───
  { id: 'an1', lat: 11.6234, lng: 92.7265, disease: 'Dengue Fever', severity: 'doctor', cases: 48, street: 'Aberdeen Bazaar, Port Blair', city: 'Port Blair', state: 'Andaman & Nicobar Island', lastReported: '2026-03-04', description: 'Island dengue outbreak during monsoon season.' },
  { id: 'an2', lat: 11.67, lng: 92.74, disease: 'Malaria', severity: 'doctor', cases: 56, street: 'Phoenix Bay, Marina Park', city: 'Port Blair', state: 'Andaman & Nicobar Island', lastReported: '2026-03-03', description: 'Tropical malaria near coastal mangrove areas.' },
  { id: 'an3', lat: 11.64, lng: 92.72, disease: 'Leptospirosis', severity: 'doctor', cases: 23, street: 'Junglighat, Main Rd', city: 'Port Blair', state: 'Andaman & Nicobar Island', lastReported: '2026-02-28', description: 'Lepto from heavy rainfall and flooding in low areas.' },

  // ─── PUDUCHERRY ───
  { id: 'pu1', lat: 11.9416, lng: 79.8083, disease: 'Dengue Fever', severity: 'doctor', cases: 71, street: 'White Town, Rue Romain Rolland', city: 'Puducherry', state: 'Puducherry', lastReported: '2026-03-04', description: 'Dengue in French colonial quarters with old drainage.' },
  { id: 'pu2', lat: 11.93, lng: 79.83, disease: 'Chikungunya', severity: 'doctor', cases: 38, street: 'Kamaraj Salai, Beach Rd', city: 'Puducherry', state: 'Puducherry', lastReported: '2026-03-01', description: 'Chikungunya near beachfront tourist areas.' },
  { id: 'pu3', lat: 11.95, lng: 79.81, disease: 'Typhoid', severity: 'doctor', cases: 27, street: 'Maraimalai Adigal Salai, Karaikal', city: 'Karaikal', state: 'Puducherry', lastReported: '2026-02-25', description: 'Typhoid from contaminated coastal groundwater.' },

  // ─── LAKSHADWEEP ───
  { id: 'lk1', lat: 10.5626, lng: 72.6369, disease: 'Dengue Fever', severity: 'doctor', cases: 18, street: 'Kavaratti Island, Bazaar St', city: 'Kavaratti', state: 'Lakshadweep', lastReported: '2026-03-02', description: 'Island dengue cluster from rainwater collection tanks.' },
  { id: 'lk2', lat: 11.25, lng: 72.18, disease: 'Hepatitis A', severity: 'self-care', cases: 9, street: 'Agatti Island, Main Rd', city: 'Agatti', state: 'Lakshadweep', lastReported: '2026-02-20', description: 'Isolated hepatitis from seafood preparation hygiene.' },

  // ─── DAMAN & DIU ───
  { id: 'dd1', lat: 20.4283, lng: 72.8397, disease: 'Malaria', severity: 'doctor', cases: 32, street: 'Seaface Rd, Nani Daman', city: 'Daman', state: 'Daman & Diu', lastReported: '2026-03-01', description: 'Coastal malaria near salt pan wetlands.' },
  { id: 'dd2', lat: 20.71, lng: 70.99, disease: 'Dengue Fever', severity: 'doctor', cases: 24, street: 'Fort Rd, Diu Town', city: 'Diu', state: 'Daman & Diu', lastReported: '2026-02-26', description: 'Dengue in heritage fort area tourist zones.' },

  // ─── DADARA & NAGAR HAVELLI ───
  { id: 'dn1', lat: 20.1809, lng: 73.0169, disease: 'Malaria', severity: 'doctor', cases: 46, street: 'Silvassa Main Rd', city: 'Silvassa', state: 'Dadara & Nagar Havelli', lastReported: '2026-03-03', description: 'Tribal belt malaria near forested industrial zones.' },
  { id: 'dn2', lat: 20.27, lng: 72.99, disease: 'Dengue Fever', severity: 'doctor', cases: 31, street: 'Vapi-Silvassa Rd, Khanvel', city: 'Silvassa', state: 'Dadara & Nagar Havelli', lastReported: '2026-02-27', description: 'Dengue along industrial corridor with poor sanitation.' },

  // ─── ARUNANCHAL PRADESH ───
  { id: 'ar1', lat: 27.0844, lng: 93.6053, disease: 'Malaria', severity: 'emergency', cases: 124, street: 'Ganga Market, Naharlagun', city: 'Itanagar', state: 'Arunanchal Pradesh', lastReported: '2026-03-05', description: 'Severe malaria in remote forested mountainous regions.' },
  { id: 'ar2', lat: 27.1, lng: 93.62, disease: 'Japanese Encephalitis', severity: 'doctor', cases: 39, street: 'Zero Point, Itanagar', city: 'Itanagar', state: 'Arunanchal Pradesh', lastReported: '2026-03-03', description: 'JE in valleys with pig farming and rice cultivation.' },
  { id: 'ar3', lat: 27.08, lng: 93.61, disease: 'Tuberculosis', severity: 'doctor', cases: 27, street: 'Bank Tinali, Itanagar', city: 'Itanagar', state: 'Arunanchal Pradesh', lastReported: '2026-02-26', description: 'TB in high-altitude settlements with limited healthcare.' },
  { id: 'ar4', lat: 27.11, lng: 93.59, disease: 'Typhoid', severity: 'doctor', cases: 22, street: 'Banderdewa Check Post Rd', city: 'Itanagar', state: 'Arunanchal Pradesh', lastReported: '2026-02-22', description: 'Typhoid from mountain spring water contamination.' },
];
