import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, PackageCheck, QrCode, ShieldCheck, Truck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SERVICES = [
  {
    tag: "Inter-city",
    title: "Parcels between branches",
    body:
      "Drop your parcel at any Eagle Courier branch. We move it on our scheduled routes to Kigali, Huye, Musanze and beyond — every handover scanned and logged.",
    image: "/images/bus-nyabugogo.jpg",
    alt: "Inter-city bus on a road in Kigali, Rwanda"
  },
  {
    tag: "Last mile",
    title: "City delivery by moto",
    body:
      "Within the city, our riders deliver door-to-door the same day. Your receiver gets a call, then a package at their gate.",
    image: "/images/moto-kigali.jpg",
    alt: "Motorbike taxis on a street in Kigali, Rwanda"
  },
  {
    tag: "Nationwide",
    title: "Cargo to every province",
    body:
      "From the hills of Nyungwe to the streets of Kigali, our network covers Rwanda end to end with tracked, insured cargo movement.",
    image: "/images/nyungwe-road.jpg",
    alt: "Tarmac road through Nyungwe forest, Rwanda"
  }
];

const STEPS = [
  {
    title: "Register at the branch",
    body:
      "Bring your parcel to any branch. Staff capture sender and receiver details, weigh and price it, and print a receipt with a unique tracking code and QR."
  },
  {
    title: "We move it, you watch it",
    body:
      "Every dispatch, arrival, and transfer between branches is scanned into the system. The tracking timeline updates in real time."
  },
  {
    title: "Verified handover",
    body:
      "The receiver shows their national ID at the destination branch — matched against the record — before the parcel is released."
  }
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <SiteHeader />

      {/* Hero */}
      <section className="hero-home" id="track">
        <div className="hero-media">
          <Image
            src="/images/kigali-traffic.jpg"
            alt="Evening traffic on a main road in Kigali, Rwanda"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <p className="kicker">Courier &amp; cargo · Rwanda</p>
          <h1>From Kigali to every corner of Rwanda — tracked, every step.</h1>
          <p className="hero-lede">
            Register a parcel at any branch, follow its journey with a tracking code or QR scan,
            and collect it with ID verification. Fast routes, honest pricing, real visibility.
          </p>

          <form className="track-hero" action="/track" method="get">
            <input
              name="code"
              placeholder="Enter your tracking code"
              aria-label="Tracking code"
              required
            />
            <button className="accent-button" type="submit">
              Track package
              <ArrowRight size={18} />
            </button>
          </form>

          <ul className="hero-badges">
            <li><ShieldCheck size={15} /> ID-verified delivery</li>
            <li><QrCode size={15} /> QR receipts</li>
            <li><Truck size={15} /> Same-day city delivery</li>
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <p className="kicker">What we move</p>
            <h2>Parcels, cargo, and city delivery — with one tracking code</h2>
            <p>
              Everything is registered at the branch, priced up front, and traceable from drop-off
              to handover.
            </p>
          </div>

          <div className="service-grid">
            {SERVICES.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-photo">
                  <Image src={service.image} alt={service.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
                </div>
                <div className="service-card-body">
                  <span className="service-tag">{service.tag}</span>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-alt" id="how-it-works">
        <div className="container">
          <div className="section-head center">
            <p className="kicker">How it works</p>
            <h2>Three steps, no guesswork</h2>
          </div>

          <div className="steps">
            {STEPS.map((step, index) => (
              <div className="step" key={step.title}>
                <span className="step-num">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="section" id="coverage">
        <div className="container coverage-grid">
          <div className="coverage-photos">
            <div className="photo-frame">
              <Image
                src="/images/kigali-city.jpg"
                alt="A busy street in downtown Kigali with shops and vehicles"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <div className="photo-frame">
              <Image
                src="/images/bugesera-road.jpg"
                alt="A tarmac road in Bugesera District, Rwanda"
                fill
                sizes="(max-width: 900px) 50vw, 25vw"
              />
            </div>
          </div>

          <div className="coverage-copy">
            <p className="kicker">Branches &amp; coverage</p>
            <h2>Close to home, wherever home is</h2>
            <p>
              Our branches sit at the main transport hubs, so your parcel rides the routes that
              already run every day. Walk in, register, and we handle the rest — across the
              country.
            </p>
            <ul className="branch-pills">
              <li><MapPin size={16} /> Kigali</li>
              <li><MapPin size={16} /> Huye</li>
              <li><MapPin size={16} /> Musanze</li>
            </ul>
            <p style={{ marginTop: "1.4rem" }}>
              <Link href="#track" className="primary-button">
                <PackageCheck size={18} />
                Track a parcel now
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-alt qa-section" id="faq">
        <div className="container">
          <div className="section-head center">
            <p className="kicker">Questions</p>
            <h2>Everything you need to know</h2>
          </div>

          <div className="qa-grid">
            <details className="qa-card" open>
              <summary>How do I track my shipment?</summary>
              <div className="qa-body">
                <p>
                  Enter the tracking code printed on your receipt (for example
                  EAG-KGL-2026-000245) in the tracking box above, or scan the QR code on your
                  receipt with your phone camera. You&apos;ll see the live status and full journey
                  of the parcel.
                </p>
              </div>
            </details>
            <details className="qa-card">
              <summary>What do I need to collect a parcel?</summary>
              <div className="qa-body">
                <p>
                  Bring the original national ID matching the receiver details registered at
                  drop-off. Our staff verify the ID against the record before releasing any
                  parcel — this protects senders and receivers alike.
                </p>
              </div>
            </details>
            <details className="qa-card">
              <summary>How is my personal data handled?</summary>
              <div className="qa-body">
                <p>
                  The public tracking page only shows initials and masked phone numbers. Full
                  sender and receiver details stay private to branch staff and are used solely for
                  delivery and verification.
                </p>
              </div>
            </details>
            <details className="qa-card">
              <summary>How much does delivery cost?</summary>
              <div className="qa-body">
                <p>
                  Pricing depends on route, package size, and weight, and is agreed with you at
                  the branch before dispatch. Every parcel comes with a printed receipt showing
                  exactly what you paid.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container cta-band-inner">
          <div>
            <h2>Ready to send something?</h2>
            <p>
              Walk into any branch to register your parcel — or track one already on its way.
            </p>
          </div>
          <div className="cta-actions">
            <a href="#track" className="primary-button">
              Track a package
              <ArrowRight size={18} />
            </a>
            <Link href="/login" className="secondary-button">
              Staff login
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
