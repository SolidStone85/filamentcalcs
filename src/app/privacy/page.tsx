import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `Privacy policy for ${SITE.name}.com.`,
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated September 5, 2026</p>
      <div className="mt-8 space-y-8 text-sm leading-7 text-muted-foreground">
        <section>
          <h2 className="text-lg font-medium text-foreground">Calculator inputs and shared links</h2>
          <p className="mt-2">Calculations run in your browser. There is no calculator account or server-side library of your saved jobs. Inputs are included in the page URL so you can bookmark a calculation or share its result.</p>
          <p className="mt-2">Those URLs can appear in browser history and in requests when you open, reload or navigate to a calculation. A link you share contains the values you entered. Avoid putting confidential information into shared calculations.</p>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground">Settings on your device</h2>
          <p className="mt-2">If you choose Remember my settings, supported tools save preferences such as currency and spool pricing in this browser&apos;s local storage. The controls describe what is saved and let you clear it. These preferences do not sync between devices. Your theme preference may also be saved locally.</p>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground">Site analytics and hosting</h2>
          <p className="mt-2">We use Vercel Web Analytics for aggregate information about page visits, referrers, device types and approximate regions. We remove query parameters and URL fragments from analytics event URLs so those URLs do not include calculator inputs. We do not send calculator field values as custom analytics events.</p>
          <p className="mt-2">Vercel describes its analytics as using no third-party analytics cookies. Hosting infrastructure also processes requests to deliver and protect the site. See <a href="https://vercel.com/docs/analytics/privacy-policy" className="text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer">Vercel&apos;s analytics privacy information</a> for details.</p>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground">Amazon affiliate links</h2>
          <p className="mt-2">Some pages link to relevant products on Amazon. As an Amazon Associate I earn from qualifying purchases. Following a product link takes you to Amazon, where its own privacy and cookie policies apply. We do not process purchases or payment details on this site.</p>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground">Contact</h2>
          <p className="mt-2">For questions or corrections, use the <Link href="/contact" className="text-primary underline underline-offset-4">contact page</Link>. Information you choose to send by email is used to respond to your message.</p>
        </section>
      </div>
    </div>
  );
}
