import technicianIcon from "../assets/600x400.svg";
import shopIcon from "../assets/shopIcon.svg";
import partnerIcon from "../assets/PartnerIcon.svg";

export function TechnicianIcon({ className }: { className?: string }) {
  return (
    <img
      src={technicianIcon}
      alt="Technician"
      className={className}
      style={{ width: '40px', height: '40px' }}
    />
  );
}

export function ShopIcon({ className }: { className?: string }) {
  return (
    <img
      src={shopIcon}
      alt="Shop"
      className={className}
      style={{ width: '40px', height: '40px' }}
    />
  );
}

export function PartnerIcon({ className }: { className?: string }) {
  return (
    <img
      src={partnerIcon}
      alt="Partner"
      className={className}
      style={{ width: '40px', height: '40px' }}
    />
  );
}
