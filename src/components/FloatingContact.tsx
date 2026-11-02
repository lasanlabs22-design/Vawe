import { site, whatsappLink } from "@/lib/site";
import { PhoneIcon, WhatsAppIcon } from "./Icons";

export default function FloatingContact() {
  return (
    <div className="floaters" aria-label={`Contact ${site.name}`}>
      <a
        className="fl-wa"
        href={whatsappLink(`Hi ${site.name}, I'd like to know more about your products.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
      <a className="fl-call" href={site.phoneHref} aria-label={`Call ${site.phone}`}>
        <PhoneIcon />
      </a>
    </div>
  );
}
