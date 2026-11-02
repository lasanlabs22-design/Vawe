"use client";

import Image from "next/image";
import { useState } from "react";
import { collections } from "@/lib/collections";
import { site, whatsappLink } from "@/lib/site";

// No backend needed: the enquiry is composed into a WhatsApp message to the studio.
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = [
      `Hi ${site.name}, I'd like a consultation.`,
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      `Location: ${f.get("city")}`,
      `Interested in: ${f.get("product")}`,
      f.get("message") ? `Project: ${f.get("message")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="form-done" role="status">
        <Image src="/brand/vawe-mark.png" alt="" width={904} height={796} />
        <h3 className="t-h3">
          Thank you. <em>We&apos;ll be in touch.</em>
        </h3>
        <p className="t-body">
          Your enquiry has opened in WhatsApp. Just hit send. If it didn&apos;t open, call us on{" "}
          <a href={site.phoneHref} style={{ color: "var(--pink-light)" }}>
            {site.phone}
          </a>
          .
        </p>
        <button className="link-line" style={{ justifySelf: "start" }} onClick={() => setSent(false)}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-row">
        <label className="field">
          <span className="field-label">Name</span>
          <input className="input" name="name" required autoComplete="name" placeholder="Your full name" />
        </label>
        <label className="field">
          <span className="field-label">Phone</span>
          <input
            className="input"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9+\s\-]{8,}"
            placeholder="+91"
          />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span className="field-label">Location</span>
          <input className="input" name="city" required placeholder="Area / city" autoComplete="address-level2" />
        </label>
        <label className="field">
          <span className="field-label">Interested in</span>
          <select className="select" name="product" defaultValue="Not sure yet">
            {collections.map((c) => (
              <option key={c.slug}>{c.name}</option>
            ))}
            <option>Not sure yet</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span className="field-label">Your project</span>
        <textarea
          className="textarea"
          name="message"
          rows={3}
          placeholder="Room, approximate size, finishes you like. Reference photos welcome on WhatsApp."
        />
      </label>
      <div className="form-foot">
        <p className="form-note">Sends your enquiry straight to our team on WhatsApp.</p>
        <button type="submit" className="btn btn-pink on-dark-btn">
          Send enquiry <span className="arrow">→</span>
        </button>
      </div>
    </form>
  );
}
