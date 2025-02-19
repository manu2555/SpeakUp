-- Create agencies table
CREATE TABLE IF NOT EXISTS agencies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(50) NOT NULL,
  customer_care_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on department for faster lookups
CREATE INDEX IF NOT EXISTS idx_agencies_department ON agencies(department);

-- Insert agency data
INSERT INTO agencies (code, name, department, customer_care_email) VALUES
-- Banks
('sbi', 'State Bank of India', 'banks', 'customercare@sbi.co.in'),
('pnb', 'Punjab National Bank', 'banks', 'customercare@pnb.co.in'),
('boi', 'Bank of India', 'banks', 'customercare@bankofindia.co.in'),
('bob', 'Bank of Baroda', 'banks', 'customercare@bankofbaroda.com'),
('hdfc', 'HDFC Bank', 'banks', 'customercare@hdfcbank.com'),
('icici', 'ICICI Bank', 'banks', 'customercare@icicibank.com'),
('axis', 'Axis Bank', 'banks', 'customercare@axisbank.com'),
('kotak', 'Kotak Mahindra Bank', 'banks', 'customercare@kotak.com'),

-- Airlines
('airindia', 'Air India', 'airlines', 'customercare@airindia.in'),
('vistara', 'Vistara', 'airlines', 'customercare@vistara.com'),
('indigo', 'IndiGo', 'airlines', 'customercare@goindigo.in'),
('spicejet', 'SpiceJet', 'airlines', 'customercare@spicejet.com'),
('airasia', 'Air Asia India', 'airlines', 'customercare@airasia.co.in'),
('akasa', 'Akasa Air', 'airlines', 'customercare@akasaair.com'),

-- Telecoms
('jio', 'Reliance Jio', 'telecoms', 'customercare@jio.com'),
('airtel', 'Bharti Airtel', 'telecoms', 'customercare@airtel.com'),
('vi', 'Vodafone Idea', 'telecoms', 'customercare@vodafoneidea.com'),
('bsnl', 'BSNL', 'telecoms', 'customercare@bsnl.co.in'),
('mtnl', 'MTNL', 'telecoms', 'customercare@mtnl.net.in'),

-- Healthcare
('aiims', 'All India Institute of Medical Sciences', 'healthcare', 'customercare@aiims.edu.in'),
('apollo', 'Apollo Hospitals', 'healthcare', 'customercare@apollohospitals.com'),
('fortis', 'Fortis Healthcare', 'healthcare', 'customercare@fortishealthcare.com'),
('max', 'Max Healthcare', 'healthcare', 'customercare@maxhealthcare.com'),
('medanta', 'Medanta', 'healthcare', 'customercare@medanta.org'),

-- Government
('central', 'Central Government', 'government', 'grievance@gov.in'),
('state', 'State Government', 'government', 'stategrievance@gov.in'),
('municipal', 'Municipal Corporation', 'government', 'municipalgrievance@gov.in'),
('panchayat', 'Panchayati Raj', 'government', 'panchayatgrievance@gov.in'),

-- Finance
('sebi', 'SEBI', 'finance', 'customercare@sebi.gov.in'),
('rbi', 'Reserve Bank of India', 'finance', 'customercare@rbi.org.in'),
('irdai', 'IRDAI', 'finance', 'customercare@irdai.gov.in'),
('pfrda', 'PFRDA', 'finance', 'customercare@pfrda.org.in'),
('nabard', 'NABARD', 'finance', 'customercare@nabard.org'),

-- Entertainment
('netflix', 'Netflix India', 'entertainment', 'customercare@netflix.co.in'),
('amazon', 'Amazon Prime Video', 'entertainment', 'customercare@primevideo.in'),
('hotstar', 'Disney+ Hotstar', 'entertainment', 'customercare@hotstar.com'),
('sony', 'Sony LIV', 'entertainment', 'customercare@sonyliv.com'),
('zee', 'ZEE5', 'entertainment', 'customercare@zee5.com'),

-- Railways
('ir', 'Indian Railways', 'railways', 'customercare@indianrailways.gov.in'),
('irctc', 'IRCTC', 'railways', 'customercare@irctc.co.in'),
('konkan', 'Konkan Railways', 'railways', 'customercare@konkanrailways.gov.in'),
('metro', 'Metro Railways', 'railways', 'customercare@metrorailways.gov.in'),
('nfr', 'Northeast Frontier Railway', 'railways', 'customercare@nfr.indianrailways.gov.in'),
('wr', 'Western Railway', 'railways', 'customercare@wr.indianrailways.gov.in');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agencies_updated_at
    BEFORE UPDATE ON agencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 