// Single source of truth for business details.
// TODO(vawe): confirm the domain (inferred from the email address).
export const site = {
  name: "Vawe Interio",
  shortName: "Vawe",
  tagline: "Glass · Mirror · Shutters",
  description:
    "Vawe Interio designs and installs made-to-measure openable shutters, sliding wardrobe shutters, sliding partitions, LED mirrors, bathroom partitions, fabric glass and bevelled mirrors.",
  url: "https://vaweinterio.com",
  phone: "+91 90352 89169",
  phoneHref: "tel:+919035289169",
  whatsapp: "919035289169",
  email: "info@vaweinterio.com",
  city: "Bengaluru",
  copyrightYear: 2026,
  studio: {
    name: "Vawe Studio & Workshop",
    area: "Huskur, Bengaluru",
    address: "3/2, Chintalamadivala Main Rd, Harohalli, Huskur, Chintalamadivala, Karnataka 560099",
    hours: "Mon to Sat · by appointment",
    mapUrl: "https://maps.app.goo.gl/VS4dNR1mqEdq4vqL6",
    mapEmbed:
      "https://www.google.com/maps?output=embed&q=" +
      encodeURIComponent("Chintalamadivala Main Rd, Huskur, Karnataka 560099"),
  },
  social: {
    instagram: "https://www.instagram.com/vaweinterio",
    facebook: "https://www.facebook.com/share/p/19jkEnaubu/",
    youtube: "https://youtu.be/UBJLDS6emoE",
  },
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
