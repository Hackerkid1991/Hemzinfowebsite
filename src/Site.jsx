import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  ShieldCheck,
  DollarSign,
  Server,
  Network,
  BadgeCheck,
  Headphones,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// --- Logo files in /public ---
const LOGO_FULL = "/hemz-logo-full.svg"; // mark + wordmark
const LOGO_MARK = "/hemz-logo-mark.svg"; // icon only (used in footer favicon etc.)

export default function Site() {
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Contact form status (no-redirect) ---
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Smooth scroll
  const smoothScrollTo = (targetY, duration = 600) => {
    const startY = window.scrollY || window.pageYOffset;
    const diff = targetY - startY;
    let start;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, Math.round(startY + diff * eased));
      if (elapsed < duration) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    setMenuOpen(false);
    if (!el) return;
    const headerOffset = 80;
    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerOffset;
    smoothScrollTo(targetY, 600);
  };

  // Favicon -> use the mark SVG
  useEffect(() => {
    const linkId = "site-favicon";
    let link = document.querySelector(`link#${linkId}`);
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = LOGO_MARK;
    link.type = "image/svg+xml";
  }, []);

  // --- Handle contact form submit (no redirect) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.target;
    const formData = new FormData(form);

    // Optional: subject line in your inbox
    formData.append("_subject", "New inquiry from hemzinfotech.com");

    try {
      const res = await fetch("https://formspree.io/f/xrblwnbq", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(
          data?.errors?.map((e) => e.message).join(", ") ||
            "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <button
              onClick={() => scrollTo("hero")}
              className="flex items-center relative bg-white/80 backdrop-blur gap-3 cursor-pointer group focus:outline-none focus:ring-0"
              aria-label="Go to top"
            >
              <div className="relative h-[43px] w-[190px] bg-white/80 backdrop-blur overflow-hidden rounded-md">
                <img
                  src={LOGO_FULL}
                  alt="Hemz InfoTech"
                  className="h-[52px] w-auto origin-left scale-[2.6] -translate-x-[20px] -translate-y-[2px]"
                />
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {[
                { id: "services", label: "Services" },
                { id: "why", label: "Why Us" },
                { id: "about", label: "Vision" },
                { id: "contact", label: "Contact" },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="hover:text-indigo-600 transition focus:outline-none focus:ring-0"
                >
                  {l.label}
                </button>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-0"
              >
                Get a Quote <ArrowRight className="h-4 w-4" />
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-0"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle menu"
            >
              Menu
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div id="mobile-nav" className="md:hidden border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
              {[
                { id: "services", label: "Services" },
                { id: "why", label: "Why Us" },
                { id: "about", label: "Vision" },
                { id: "contact", label: "Contact" },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="text-left py-2 focus:outline-none focus:ring-0"
                >
                  {l.label}
                </button>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-0"
              >
                Get a Quote <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.25),transparent_35%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Secure, Scalable, Cost-Efficient{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
                Multi-Cloud
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl">
              We empower startups and mid-sized businesses to achieve their
              goals through optimized costs, seamless migrations, and tailored
              cloud &amp; IT solutions—backed by 24/7 support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("services")}
                className="rounded-xl bg-slate-900 text-white px-5 py-3 text-sm shadow hover:bg-slate-800 focus:outline-none focus:ring-0"
              >
                Explore Services
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm hover:border-slate-400 focus:outline-none focus:ring-0"
              >
                Talk to an Expert
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4" /> Proven cost savings up to
                30%
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Security &amp; compliance
                first
              </span>
              <span className="inline-flex items-center gap-2">
                <Network className="h-4 w-4" /> AWS • Azure • GCP
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: DollarSign,
                    title: "Cost Optimization & FinOps",
                    desc: "Streamline multi-cloud spend without sacrificing performance.",
                  },
                  {
                    icon: Network,
                    title: "Cloud Migration & Network",
                    desc: "Smooth, secure migrations with low-latency architectures.",
                  },
                  {
                    icon: Server,
                    title: "Infra & DevOps Mgmt",
                    desc: "24/7 monitoring, backup, DR, and DevOps support.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Security & Compliance",
                    desc: "IAM, threat protection, governance & audits.",
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border p-4 hover:shadow-md transition"
                  >
                    <c.icon className="h-5 w-5" />
                    <p className="mt-2 font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-slate-600">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Services</h2>
            <p className="mt-2 text-slate-600">
              End-to-end capabilities across strategy, build, and run.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Cost Optimization & FinOps",
                points: [
                  "Identify & eliminate unnecessary spend",
                  "Analytics-driven savings (up to 30%)",
                  "Budgets, forecasting & reporting",
                ],
              },
              {
                icon: Network,
                title: "Cloud Migration & Network Optimization",
                points: [
                  "Phased assessments & execution",
                  "Secure, scalable, low-latency architectures",
                  "Minimal disruption to business",
                ],
              },
              {
                icon: Server,
                title: "Infrastructure & DevOps Management",
                points: [
                  "24/7 monitoring, backup & DR",
                  "CI/CD pipelines & automation",
                  "SRE best practices for reliability",
                ],
              },
              {
                icon: ShieldCheck,
                title: "Security & Compliance",
                points: [
                  "IAM hardening & threat protection",
                  "Governance, audits & policy as code",
                  "Regulatory alignment & posture mgmt",
                ],
              },
              {
                icon: BadgeCheck,
                title: "Audit & Governance",
                points: [
                  "Cost, performance & security reviews",
                  "Architecture health checks",
                  "Actionable remediation plans",
                ],
              },
              {
                icon: Headphones,
                title: "Billing & Multi-Cloud Support",
                points: [
                  "Unified visibility across AWS, Azure, GCP",
                  "Centralized billing, budgeting & alerts",
                  "Ongoing improvements & dedicated support",
                ],
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-3xl border bg-white p-6 shadow-sm hover:shadow-md"
              >
                <card.icon className="h-6 w-6" />
                <h3 className="mt-3 font-semibold">{card.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-5">
                  {card.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-16 lg:py-24 bg-gradient-to-br from-white to-slate-100 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Why Partner With Us
            </h2>
            <p className="mt-2 text-slate-600">
              Experience, partnerships, and a results-first mindset.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BadgeCheck,
                title: "Experienced Team",
                desc: "Cross-industry expertise with certified professionals.",
              },
              {
                icon: Cloud,
                title: "Multi-Cloud Native",
                desc: "Deep experience across AWS, Azure, and GCP.",
              },
              {
                icon: ShieldCheck,
                title: "Security-First",
                desc: "Compliance, governance, and robust protection by design.",
              },
              {
                icon: DollarSign,
                title: "Proven Savings",
                desc: "Documented cost reductions up to 30%.",
              },
              {
                icon: Server,
                title: "End-to-End Delivery",
                desc: "From strategy to operations, including DevOps & DR.",
              },
              {
                icon: Headphones,
                title: "Vendor & Licensing",
                desc: "Authorized Microsoft reseller, OEM partnerships, best-price coordination.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <f.icon className="h-6 w-6" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Our Vision</h2>
          <p className="mt-4 text-slate-700 leading-relaxed">
            We empower startups and mid-sized businesses to achieve their goals
            by leveraging the right technology in a secure, scalable, and
            cost-efficient way. As your partner in cost optimization, cloud
            migration, and pinpoint services, we combine expertise, innovation,
            and a personalized approach to drive sustainable growth and
            long-term value.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 lg:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Let’s talk</h2>
              <p className="mt-2 text-slate-300">
                Tell us about your goals. We’ll propose a clear, cost-effective
                plan.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> sales@hemzinfotech.com
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> +91 8015506314
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> 715A 7 Floor, Spencer Plaza
                  Mall, Anna Salai, Chennai, Tamilnadu - 600002
                </p>
              </div>
            </div>

            {/* FORM: AJAX to Formspree, no redirect */}
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white text-slate-900 p-6 shadow-xl ring-1 ring-slate-200"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Name</label>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="you@company.com"
                  />
                </div>

                {/* NEW: Phone (required) */}
                <div className="sm:col-span-2">
                  <label className="text-sm">Phone</label>
                  <input
                    name="phone"
                    required
                    inputMode="tel"
                    pattern="^[0-9+\-\s()]{7,20}$"
                    title="Enter a valid phone number"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder=""
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm">Company</label>
                  <input
                    name="company"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="Company name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm">How can we help?</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    placeholder="Cost optimization, migration, DevOps, security, etc."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white shadow hover:bg-indigo-500 disabled:opacity-50 focus:outline-none focus:ring-0"
              >
                {status === "loading" ? "Sending..." : "Send Inquiry"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Success / Error messages */}
              {status === "success" && (
                <p className="mt-3 text-sm text-green-600">
                  ✅ Thank you! Your message has been sent.
                </p>
              )}
              {status === "error" && (
                <p className="mt-3 text-sm text-red-600">
                  ❌ {errorMsg}
                </p>
              )}

              <p className="mt-3 text-xs text-slate-500">
                By submitting, you agree to our terms & privacy policy.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 cursor-pointer group focus:outline-none focus:ring-0"
            aria-label="Go to top"
          >
            <div className="relative h-[32px] w-[156px] overflow-hidden rounded">
              <img
                src={LOGO_FULL}
                alt="Hemz InfoTech"
                className="h-[32px] w-auto origin-left scale-[2.6] -translate-x-[12px] -translate-y-[1px]"
              />
            </div>
          </button>
          <div className="flex flex-wrap items-center gap-3 text-slate-500">
            <span>Multi-cloud:</span>
            <span className="rounded-full border px-3 py-1">AWS</span>
            <span className="rounded-full border px-3 py-1">Azure</span>
            <span className="rounded-full border px-3 py-1">GCP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
