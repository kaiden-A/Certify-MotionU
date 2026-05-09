import CertificateGenerator from '../components/CertificateGenerator';

export const metadata = {
  title: 'Certify — Bulk Certificate Generator',
  description: 'Upload a CSV and a template. Download a ZIP.',
};

export default function Home() {
  return <CertificateGenerator />;
}