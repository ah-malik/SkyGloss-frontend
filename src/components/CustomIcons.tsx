import technicianIcon from "../assets/600x400.svg";
import shopIcon from "../assets/shopIcon.svg";
import distributorIcon from "../assets/distributorIcon.svg";

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

export function DistributorIcon({ className }: { className?: string }) {
  return (
    <img
      src={distributorIcon}
      alt="Distributor"
      className={className}
      style={{ width: '40px', height: '40px' }}
    />
  );
}
