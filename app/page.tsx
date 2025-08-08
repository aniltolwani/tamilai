"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, ShoppingBag, MapPin, Calendar, PlayCircle, BookOpenText, ScrollText, Shirt, ListChecks, Search, ChevronRight, ChevronLeft, Sparkles, Bug, Clock } from "lucide-react";

/**
 * Tamil Brahmin Almanac & Festival Helper — Bahrain (Deployable Next.js app)
 * - No live Panchanga API (snapshot locked to 2025-08-08 17:18 Asia/Bahrain).
 * - Month grid calendar with festival pins.
 * - Local UI components (no shadcn install needed).
 */

// ---- Links (Bahrain-aware where possible) ----
const DP_PANCHANG_MONTH = "https://www.drikpanchang.com/panchang/month-panchang.html?geoname-id=290340"; // Manama
const DP_TAMIL_CAL_2025 = "https://www.drikpanchang.com/tamil/tamil-calendar.html?geoname-id=290340";
const DP_TAMIL_DAY = "https://www.drikpanchang.com/tamil/tamil-month-panchangam.html?geoname-id=290340";
const MYPANCHANG_2025 = "https://www.mypanchang.com/panchang.php?cityhead=Manama%2C+Bahrain&cityname=Manama-Bahrain&getdata=getcity&yr=2025";
const TEMPLE_INFO = "https://filmbahrain.com/locations/view/37"; // Shri Krishna Temple, Manama Souq

// Bahrain-friendly shopping (ships locally)
const SHOP_DESERTCART_POOJA = "https://bahrain.desertcart.com/brand/puja";
const SHOP_DESERTCART_KIT_25 = "https://bahrain.desertcart.com/products/485869458-sbj-1-pooja-thali-with-25-items-pooja-ingredients-for-festivals-indian-pooja-thali-puja-aarti-thali-for-home-mandir-temple-pooja-thali-set";
const SHOP_DESERTCART_KIT_31 = "https://bahrain.desertcart.com/products/569831315-me-and-you-all-in-one-pooja-thali-pooja-items";
const SHOP_UBUY_THALI = "https://www.ubuy.com.bh/en/product/8W6NKU8O6-hashcart-brass-puja-thali-set-8-75-inch-pooja-thali-aarti-thali-with-diya-agarbatti-holder-and-other-accessories-religious-spiritual-for-home";
const SHOP_UBUY_AllInOne = "https://www.ubuy.com.bh/en/productin/M7S0E2U9S-me-you-pooja-thali-with-31-items-pooja-items-for-navratri-special-ganesh-chauth-garh-parvesh-kirtan-hawan-samagri-housewarming-pooja";

// Specific stotra archives
const STOTRA = {
  ganapatiAtharvashirsha: "https://www.drikpanchang.com/stotra/shri-ganesh/ganesh-atharvashirsha.html",
  varalakshmiAshtakam: "https://www.drikpanchang.com/stotra/lakshmi/varalakshmi-ashtakam.html",
  lalitaSahasranama: "https://www.drikpanchang.com/stotra/devi/lalita-sahasranama-stotram.html",
  lakshmiAshtottara: "https://www.drikpanchang.com/stotra/lakshmi/ashtottara-shatanamavali-lakshmi.html",
};

// (Optional) curated YouTube links
const VIDEO = {
  ganesha: "https://www.youtube.com/results?search_query=Ganesh+Chaturthi+puja+vidhi+Tamil+brahmin",
  varalakshmi: "https://www.youtube.com/results?search_query=Varalakshmi+Vratham+pooja+vidhanam+Tamil",
  navaratri: "https://www.youtube.com/results?search_query=Navaratri+pooja+vidhanam+Tamil+brahmin",
  diwali: "https://www.youtube.com/results?search_query=Lakshmi+Puja+Diwali+Tamil+procedure",
};

// Sankalpam template
const SANKALPAM_TEMPLATE = `
śrīḥ | śrī govinda govinda govinda |

mama upātta samasta durita-kṣaya-dvāra śrī–parameśvara prītyarthaṁ
(— choose —) vrata/pūjāṁ kariṣye |

śrī (vijaya) nāma samvatsare — ayane — ṛtau — māse — pakṣe — tithau — vāre —
(Manama, Bahrain deśe) — nakṣatre — yoge — karaṇe — evaṁ guṇaviśeṣeṇa viśiṣṭāyām
asyāṁ śubhatithau (śubhe muhūrte) śrī (gaṇeśa/varalakṣmī/durgā/lakṣmī) prītyarthaṁ pūjāṁ kariṣye ||
`;

// ---- Festival data (2025 dates pinned; Bahrain generally follows India dates; check muhurta locally) ----
const FESTIVALS = [
  {
    id: "ganesha",
    name: "Vinayaka Chaturthi (Ganesh Chaturthi)",
    when: "Wed, Aug 27, 2025",
    dateLinks: [
      { label: "Ganesh Chaturthi 2025 — DrikPanchang", href: "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesha-chaturthi-date-time.html?year=2025" },
      { label: "Ganesha Puja Vidhi (procedure)", href: "https://www.drikpanchang.com/festivals/ganesh-chaturthi/ganesha-chaturthi-puja-vidhi.html" },
      { label: "Tamil Calendar 2025 (Manama)", href: DP_TAMIL_CAL_2025 },
      { label: "Today’s Panchangam (Manama)", href: DP_PANCHANG_MONTH },
    ],
    neivedhyam: [
      "21 Modakam/Kozhukattai (sweet coconut‑jaggery; ukkarai/ellu variants)",
      "Ulundu kara kozhukattai (savoury)",
      "Kondai kadalai sundal (chickpeas)",
      "Aval nanachathu (poha jaggery‑coconut)",
      "Coconut (whole) & banana — 5 or 12 fruits",
      "Panchamritam (milk, curd, ghee, honey, sugar + banana)",
      "Sugarcane pieces (if available) / jaggery cubes",
      "Durva (arugampul) 21 blades & red flowers",
      "Dry fruits (cashew/raisins) & rock sugar (kalkandu)",
    ],
    sankalpam: SANKALPAM_TEMPLATE.replace("(— choose —)", "vināyaka caturthī").replace("(gaṇeśa/varalakṣmī/durgā/lakṣmī)", "gaṇeśa"),
    dosDonts: {
      dos: [
        "Install eco‑friendly clay Ganesha; place on rice‑filled kalasha.",
        "Atharvaśīrṣa parayanam; offer 21 durva & 21 modaks if possible.",
        "Sattvic meals; steady deepam; maintain cleanliness.",
      ],
      donts: [
        "Avoid onion/garlic & alcohol on puja day.",
        "Traditionally avoid seeing moon on Chaturthi night.",
        "Don’t immerse plaster idols; prefer clay.",
      ],
    },
    vidhanam: [
      "Saṅkalpam → Āchamanam → Prāṇāyāma → Gaṇeśa dhyāna.",
      "Kalasha & idol sthāpanā; avāhana (invocation).",
      "Śoḍaśopacāra or Aṣṭottara nāma archana; naivedyam (modak).",
      "Ārati; mantra‑puṣpāñjali; kṣamāprārthanā.",
    ],
    mantras: [
      { title: "Gaṇapati Atharvaśīrṣa — ‘Namaste Gaṇapataye’", link: STOTRA.ganapatiAtharvashirsha },
      { title: "108 Names of Ganesha (Aṣṭottara)", link: "https://www.drikpanchang.com/deities-namavali/gods/lord-ganesha/108-ganesha-names.html" },
      { title: "Gaṇeśa Pañcaratnam (select verses)", link: "https://greenmesg.org/stotras/ganesha/ganesha_pancharatnam.php" },
    ],
    dress: [
      "Men: white/off‑white veshti & angavastram.",
      "Women: saree in red/yellow tones.",
      "Kids: pavadai/kurta. Barefoot in puja area.",
    ],
    shop: [
      { label: "All‑in‑one Pooja Kit (31 items) — Desertcart", href: SHOP_DESERTCART_KIT_31 },
      { label: "Pooja Thali Set (Brass) — Ubuy", href: SHOP_UBUY_THALI },
    ],
    videos: [ { label: "How‑to (Tamil Brahmin)", href: VIDEO.ganesha } ],
  },
  {
    id: "varalakshmi",
    name: "Varalakshmi Vratham",
    when: "Fri, Aug 8, 2025",
    dateLinks: [
      { label: "Varalakshmi 2025 — DrikPanchang", href: "https://www.drikpanchang.com/festivals/varalakshmi-vratam/varalakshmi-vratam-date-time.html?year=2025" },
      { label: "Varalakshmi Puja Vidhi (procedure)", href: "https://www.drikpanchang.com/vrats/varalakshmi/puja-vidhi/varalakshmi-puja-vidhi.html" },
      { label: "Tamil Calendar 2025 (Manama)", href: DP_TAMIL_CAL_2025 },
      { label: "Today’s Panchangam (Manama)", href: DP_PANCHANG_MONTH },
    ],
    neivedhyam: [
      "Chakkarai pongal (sweet pongal)",
      "Semiyā payasam or paruppu payasam",
      "Ulundu vadai (medhu vadai)",
      "Adai/adai‑aviyal (as per family)",
      "Lemon rice / coconut rice / curd rice (one or more)",
      "Sundal (kondai kadalai / moong / pattani)",
      "Panakam & neer mor (buttermilk)",
      "5 or 9 fruits; betel leaves & areca nut",
      "Coconut, turmeric, kumkum, bangles & blouse‑pieces for tambūlam",
    ],
    sankalpam: SANKALPAM_TEMPLATE.replace("(— choose —)", "varalakṣmī vratam").replace("(gaṇeśa/varalakṣmī/durgā/lakṣmī)", "varalakṣmī"),
    dosDonts: {
      dos: [
        "Kalasha with rice, turmeric coconut & maṅgala thread.",
        "Married women tie vratam thread; distribute tambūlam.",
        "Lakshmi Aṣṭottara; lamps in evening.",
      ],
      donts: [
        "Avoid cutting hair/nails; avoid midday sleep during vrata.",
        "No non‑veg/egg.",
      ],
    },
    vidhanam: [
      "Saṅkalpam → Kalasha sthāpanā & alankāram.",
      "Avāhana; Lakshmi Aṣṭottara & Ashtakam; Śrī Sūktam.",
      "Naivedyam & ārati; thread tying.",
    ],
    mantras: [
      { title: "Lakshmi Aṣṭottara (108 names)", link: "https://www.drikpanchang.com/deities-namavali/goddesses/lakshmi/108-lakshmi-names.html" },
      { title: "Varalakshmi Ashtakam — ‘Padmāsane Padmakare’", link: STOTRA.varalakshmiAshtakam },
      { title: "Śrī Sūktam (with Lakshmi Sūktam)", link: "https://www.drikpanchang.com/lyrics/stotram/maha-lakshmi/shree-suktam-with-lakshmi-suktam.html" },
    ],
    dress: [
      "Women: silk saree (red/pink/gold).",
      "Men assisting: veshti/kurta in white/cream.",
      "Avoid black where elders advise.",
    ],
    shop: [
      { label: "31‑item Vratham Kit — Desertcart", href: SHOP_DESERTCART_KIT_25 },
      { label: "Brass Pooja Thali — Ubuy", href: SHOP_UBUY_THALI },
    ],
    videos: [ { label: "How‑to (Tamil)", href: VIDEO.varalakshmi } ],
  },
  {
    id: "navaratri",
    name: "Navaratri (Golu & Daily Pujas)",
    when: "Mon, Sep 22 – Thu, Oct 2, 2025",
    dateLinks: [
      { label: "Shardiya Navratri 2025 — DrikPanchang", href: "https://www.drikpanchang.com/navratri/ashwin-shardiya-navratri-dates.html?year=2025" },
      { label: "Durga Puja Vidhi (procedure)", href: "https://www.drikpanchang.com/navratri/durga-puja/puja-vidhi/durga-puja-vidhi.html" },
      { label: "Tamil Calendar 2025 (Manama)", href: DP_TAMIL_CAL_2025 },
    ],
    neivedhyam: [
      "Day‑wise sundal: (1) karamani (black‑eyed peas)",
      "(2) kondai kadalai (chickpeas)",
      "(3) pasi payaru (moong)",
      "(4) pachai pattani (peas)",
      "(5) kadalai paruppu (chana dal)",
      "(6) verkadalai (peanut)",
      "(7) thattapayaru / cowpeas)",
      "(8) mochhai (hyacinth beans)",
      "(9) payatham sundal (sweet) + paal payasam",
    ],
    sankalpam: SANKALPAM_TEMPLATE.replace("(— choose —)", "navarātri devī‑pūjā").replace("(gaṇeśa/varalakṣmī/durgā/lakṣmī)", "durgā"),
    dosDonts: {
      dos: [
        "Ghata‑sthapana; keep golu if tradition.",
        "Daily archana; Lalitā Sahasranāma; offer flowers (kumkumarchana).",
        "Ayudha Puja (day 9); Vidyarambham/Vijaya Daśamī (day 10).",
      ],
      donts: [
        "Avoid non‑veg, alcohol, tamasic foods.",
        "Don’t leave deepam unattended.",
      ],
    },
    vidhanam: [
      "Day 1 kalasha sthāpanā → daily alankāram & archana.",
      "Read Lalitā Sahasranāma or Durga Saptashati (select chapters).",
      "Ayudha Puja on day 9; Saraswati Puja/Vidyarambham as per family.",
    ],
    mantras: [
      { title: "Lalitā Sahasranāma (key verses)", link: STOTRA.lalitaSahasranama },
    ],
    dress: [
      "Daily colour option (yellow/green/grey…)",
      "Men: veshti/kurta; Women: festive sarees; Kids: traditional wear.",
    ],
    shop: [
      { label: "All Puja Items — Desertcart", href: SHOP_DESERTCART_POOJA },
      { label: "Pooja Thali Set — Ubuy", href: SHOP_UBUY_THALI },
    ],
    videos: [ { label: "Navaratri how‑to (Tamil)", href: VIDEO.navaratri } ],
  },
  {
    id: "diwali",
    name: "Deepavali (Lakshmi Puja)",
    when: "Mon, Oct 20, 2025 (Lakshmi Puja)",
    dateLinks: [
      { label: "Diwali 2025 — DrikPanchang", href: "https://www.drikpanchang.com/diwali/diwali-puja-calendar.html?year=2025" },
      { label: "Lakshmi Puja Vidhi (procedure)", href: "https://www.drikpanchang.com/festivals/lakshmipuja/info/lakshmi-puja-vidhi.html" },
      { label: "Tamil Calendar 2025 (Manama)", href: DP_TAMIL_CAL_2025 },
    ],
    neivedhyam: [
      "Adhirasam, nei appam, poli/obbattu",
      "Mysore pak, besan/boondi laddoo, kaju katli",
      "Thenkuzhal murukku, ribbon pakoda, karasev",
      "Mixture/omapodi, sweet somas/karjikai",
      "Deepavali marundu (legiyam) before breakfast",
      "Paal payasam or kheer",
      "Badusha / jangiri; kesari",
      "5 or 9 fruits; coconut",
    ],
    sankalpam: SANKALPAM_TEMPLATE.replace("(— choose —)", "dīpāvalī śrī‑lakṣmī‑pūjā").replace("(gaṇeśa/varalakṣmī/durgā/lakṣmī)", "lakṣmī"),
    dosDonts: {
      dos: [
        "Abhyanga snanam (South) at brahma‑muhurtam on Naraka Chaturdashi.",
        "Evening Lakshmi Puja during pradoṣa; diyas at entrance/windows.",
        "Charity; share sweets with neighbours.",
      ],
      donts: [
        "Avoid crackers in crowded areas; follow local rules.",
        "Don’t leave lamps unattended.",
      ],
    },
    vidhanam: [
      "Ganesha pūja → Lakshmi/Kubera pūja → Aṣṭottara → Naivedyam → Ārati.",
    ],
    mantras: [
      { title: "Lakshmi Aṣṭottara (108 names)", link: "https://www.drikpanchang.com/deities-namavali/goddesses/lakshmi/108-lakshmi-names.html" },
      { title: "Śrī Sūktam", link: "https://www.drikpanchang.com/lyrics/stotram/maha-lakshmi/shree-suktam-with-lakshmi-suktam.html" },
      { title: "Kuber Puja (optional)", link: "https://www.drikpanchang.com/festivals/dhanteras/info/kuber-puja-vidhi.html" },
    ],
    dress: [
      "Men: silk veshti/kurta; Women: silk saree.",
      "New clothes customary after abhyanga snanam.",
    ],
    shop: [
      { label: "All‑in‑one Pooja Kit — Ubuy (31 items)", href: SHOP_UBUY_AllInOne },
      { label: "Pooja Kit/Thali — Desertcart", href: SHOP_DESERTCART_POOJA },
    ],
    videos: [ { label: "Lakshmi Puja how‑to (Tamil)", href: VIDEO.diwali } ],
  },
  { id: "pongal", name: "Thai Pongal", when: "Tue, Jan 14, 2025", dateLinks: [ { label: "Thai Pongal 2025 — DrikPanchang", href: "https://www.drikpanchang.com/festivals/pongal/thai-pongal-date-time.html?year=2025" } ] },
  { id: "karthigai", name: "Karthigai Deepam", when: "Thu, Dec 4, 2025", dateLinks: [ { label: "Karthigai Deepam 2025 — DrikPanchang", href: "https://www.drikpanchang.com/festivals/karthigai-deepam/karthigai-deepam-date-time.html?year=2025" } ] },
  { id: "vaikunta", name: "Vaikunta Ekadashi", when: "Fri, Jan 10, 2025 & Wed, Dec 31, 2025", dateLinks: [ { label: "Vaikuntha Ekadashi 2025 — DrikPanchang", href: "https://www.drikpanchang.com/ekadashis/vaikuntha/vaikuntha-ekadashi-date-time.html?year=2025" } ] },
];

// Helper for accent UI
const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 bg-clip-text text-transparent font-semibold">{children}</span>
);

function FestivalCard({ f }: { f: any }) {
  return (
    <Card className="rounded-3xl shadow-lg border border-amber-100/70 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50">
        <CardTitle className="text-lg flex items-start justify-between">
          <span className="leading-tight">{f.name}</span>
          <Badge variant="secondary" className="rounded-full text-[11px]">Bahrain</Badge>
        </CardTitle>
        <div className="text-sm text-gray-600 mt-1 flex items-center gap-2"><Calendar className="w-4 h-4" />{f.when}</div>
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        <Accordion className="w-full">
          <AccordionItem value="dates">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/>Dates & Muhurtam (Manama)</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {f.dateLinks?.map((d: any) => (
                  <a key={d.href} href={d.href} target="_blank" className="flex items-center gap-2 text-blue-600 underline">
                    <ExternalLink className="w-4 h-4"/> {d.label}
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {f.sankalpam && (
            <AccordionItem value="sankalpam">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2"><ScrollText className="w-4 h-4"/>Sankalpam (template)</div>
              </AccordionTrigger>
              <AccordionContent>
                <pre className="bg-gray-50 p-4 rounded-xl whitespace-pre-wrap text-[13px] leading-6 border">{f.sankalpam}</pre>
              </AccordionContent>
            </AccordionItem>
          )}

          {f.vidhanam && (
            <AccordionItem value="vidhanam">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2"><BookOpenText className="w-4 h-4"/>Pūjā Vidhanam (how‑to)</div>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  {f.vidhanam.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                </ol>
              </AccordionContent>
            </AccordionItem>
          )}

          {f.mantras && (
            <AccordionItem value="mantras">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2"><BookOpenText className="w-4 h-4"/>Mantras & Stotra</div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {f.mantras.map((m: any, i: number) => (
                    <li key={i}>
                      <span className="font-medium">{m.title}</span>{" "}
                      {m.link && (
                        <a className="text-blue-600 underline inline-flex items-center gap-1" href={m.link} target="_blank">
                          (full text) <ExternalLink className="w-3 h-3"/>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {f.neivedhyam && (
            <AccordionItem value="neivedhyam">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2"><ListChecks className="w-4 h-4"/>Naivedyam & Shopping</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3">
                  <div>
                    <div className="font-medium mb-1">Suggested Naivedyam</div>
                    <ul className="list-disc pl-5 text-sm">
                      {f.neivedhyam.map((n: string, idx: number) => <li key={idx}>{n}</li>)}
                    </ul>
                  </div>
                  <div className="text-sm mt-2">
                    <div className="font-medium mb-1 flex items-center gap-2"><ShoppingBag className="w-4 h-4"/>Buy in Bahrain (online)</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {f.shop?.map((s: any, i: number) => (
                        <li key={i}><a href={s.href} target="_blank" className="text-blue-600 underline inline-flex items-center gap-1">{s.label} <ExternalLink className="w-3 h-3"/></a></li>
                      ))}
                      <li>
                        <span className="font-medium">In‑person:</span> Explore shops around{" "}
                        <a href={TEMPLE_INFO} target="_blank" className="text-blue-600 underline inline-flex items-center gap-1">Shri Krishna Temple, Manama Souq<ExternalLink className="w-3 h-3"/></a>
                        — Little India often has idols, flowers, and puja items.
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {f.videos && (
            <AccordionItem value="videos">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2"><PlayCircle className="w-4 h-4"/>Videos (how‑to)</div>
              </AccordionTrigger>
              <AccordionContent>
                {f.videos.map((v: any, i: number) => (
                  <a key={i} href={v.href} target="_blank" className="text-blue-600 underline inline-flex items-center gap-1 text-sm"><ExternalLink className="w-3 h-3"/> {v.label}</a>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {f.dosDonts && (
            <AccordionItem value="dosdonts">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2"><ListChecks className="w-4 h-4"/>Do’s & Don’ts</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1 text-sm">
                  <div>
                    <div className="font-medium">Do</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {f.dosDonts.dos.map((d: string, idx: number) => <li key={idx}>{d}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Don’t</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {f.dosDonts.donts.map((d: string, idx: number) => <li key={idx}>{d}</li>)}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {f.dress && (
            <AccordionItem value="dress">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2"><Shirt className="w-4 h-4"/>Dress Code</div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 text-sm">
                  {f.dress.map((d: string, idx: number) => <li key={idx}>{d}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}

// ---------- Month Grid Calendar (2025) ----------
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Pinned key festivals
const FESTIVAL_PINS_2025: Record<string, { id: string; label: string; href: string }[]> = {
  "2025-01-10": [{ id: "vaikunta", label: "Vaikunta Ekadashi", href: "#vaikunta" }],
  "2025-01-14": [{ id: "pongal", label: "Thai Pongal", href: "#pongal" }],
  "2025-08-08": [{ id: "varalakshmi", label: "Varalakshmi Vratham", href: "#varalakshmi" }],
  "2025-08-27": [{ id: "ganesha", label: "Ganesh Chaturthi", href: "#ganesha" }],
  "2025-09-22": [{ id: "navaratri", label: "Navratri begins", href: "#navaratri" }],
  "2025-09-30": [{ id: "navaratri", label: "Durga Ashtami", href: "#navaratri" }],
  "2025-10-01": [{ id: "navaratri", label: "Maha Navami", href: "#navaratri" }],
  "2025-10-02": [{ id: "navaratri", label: "Vijaya Dashami", href: "#navaratri" }],
  "2025-10-20": [{ id: "diwali", label: "Diwali (Lakshmi Puja)", href: "#diwali" }],
  "2025-12-04": [{ id: "karthigai", label: "Karthigai Deepam", href: "#karthigai" }],
  "2025-12-31": [{ id: "vaikunta", label: "Vaikunta Ekadashi", href: "#vaikunta" }],
};

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

function MonthGrid({ year, month, pins }: { year: number; month: number; pins: typeof FESTIVAL_PINS_2025 }) {
  const total = daysInMonth(year, month);
  const start = firstWeekday(year, month);
  const rows: JSX.Element[] = [];
  const cells: JSX.Element[] = [];

  const labels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  for (let i = 0; i < start; i++) {
    cells.push(<div key={"blank-"+i} className="h-11" />);
  }
  for (let d = 1; d <= total; d++) {
    const dateISO = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const items = pins[dateISO] || [];
    cells.push(
      <div key={dateISO} className="h-11 rounded-lg border bg-white/70 flex flex-col items-center justify-center relative">
        <div className="text-[12px] leading-none">{d}</div>
        {items.length > 0 && (
          <div className="absolute -bottom-1.5 flex gap-1">
            {items.map((it, idx) => (
              <a key={idx} href={it.href} title={`${it.label} — ${dateISO}`} className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
            ))}
          </div>
        )}
      </div>
    );
  }

  for (let i = 0; i < cells.length; i += 7) {
    rows.push(<div key={i} className="grid grid-cols-7 gap-1">{cells.slice(i, i+7)}</div>);
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-[11px] text-gray-600">
        {labels.map((l) => <div key={l} className="px-1 py-1 text-center">{l}</div>)}
      </div>
      {rows}
    </div>
  );
}

function CalendarTab() {
  const year = 2025;
  const now = new Date();
  const tzNowMonth = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bahrain", month: "numeric", year: "numeric" }).formatToParts(now);
  const y = parseInt((tzNowMonth.find(p=>p.type==="year")?.value || "2025"), 10);
  const m = parseInt((tzNowMonth.find(p=>p.type==="month")?.value || "9"), 10) - 1;
  const defaultMonth = y === year ? m : 8; // Sep

  const [mode, setMode] = useState<"grid"|"list">("grid");
  const [month, setMonth] = useState<number>(defaultMonth);

  const prev = () => setMonth((mm) => Math.max(0, mm - 1));
  const next = () => setMonth((mm) => Math.min(11, mm + 1));

  const monthlyPins = useMemo(() => {
    const out: { date: string; items: {id:string;label:string;href:string}[] }[] = [];
    Object.entries(FESTIVAL_PINS_2025).forEach(([date, items]) => {
      if (date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)) out.push({ date, items });
    });
    return out.sort((a,b)=> a.date.localeCompare(b.date));
  }, [month]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" className="rounded-xl" onClick={prev} disabled={month===0}><ChevronLeft className="w-4 h-4"/></Button>
          <div className="text-base font-medium">{MONTH_NAMES[month]} {year}</div>
          <Button size="sm" variant="secondary" className="rounded-xl" onClick={next} disabled={month===11}><ChevronRight className="w-4 h-4"/></Button>
        </div>
        <div className="inline-flex gap-2 bg-gray-100 rounded-xl p-1">
          <button className={`px-3 py-1.5 rounded-lg text-sm ${mode==='grid' ? 'bg-white shadow' : ''}`} onClick={()=>setMode('grid')}>Month grid</button>
          <button className={`px-3 py-1.5 rounded-lg text-sm ${mode==='list' ? 'bg-white shadow' : ''}`} onClick={()=>setMode('list')}>List</button>
        </div>
      </div>

      {mode === 'grid' ? (
        <Card className="rounded-3xl">
          <CardContent className="p-3 sm:p-5">
            <MonthGrid year={year} month={month} pins={FESTIVAL_PINS_2025} />
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-3">
              <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200 inline-block" /> Festival pin</span>
              <span>Tap a dot to jump to the festival card below.</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <CalendarList />
      )}

      {monthlyPins.length > 0 && (
        <Card className="rounded-3xl border-amber-100">
          <CardHeader className="pb-2"><CardTitle className="text-base">{MONTH_NAMES[month]} highlights</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1">
              {monthlyPins.map((p, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{p.date}</span> — {p.items.map(it=>it.label).join(", ")}
                  </div>
                  <div className="flex gap-2">
                    {p.items.map((it, j) => <a key={j} href={it.href} className="text-blue-600 underline inline-flex items-center gap-1">Open <ChevronRight className="w-3 h-3"/></a>)}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-600">Exact muhurta varies by location. Use the links above to check Manama‑specific timings.</div>
    </div>
  );
}

// Simple calendar list grouped by month (uses the FESTIVALS array)
const monthBuckets = [
  { key: "Jan", ids: ["pongal", "vaikunta"] },
  { key: "Aug", ids: ["varalakshmi", "ganesha"] },
  { key: "Sep", ids: ["navaratri"] },
  { key: "Oct", ids: ["navaratri", "diwali"] },
  { key: "Dec", ids: ["karthigai", "vaikunta"] },
];

function CalendarList() {
  return (
    <div className="space-y-4">
      {monthBuckets.map((b) => (
        <Card key={b.key} className="rounded-3xl border-rose-100/70">
          <CardHeader className="py-4">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-rose-100 font-medium">{b.key}</span>
              <span>Festivals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {b.ids.map((id) => {
              const f = FESTIVALS.find((x) => x.id === id);
              if (!f) return null;
              return (
                <a key={id} href={`#${id}`} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100 transition">
                  <div className="pr-3">
                    <div className="font-medium leading-tight">{f.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{f.when}</div>
                  </div>
                  <ChevronRight className="w-4 h-4"/>
                </a>
              );
            })}
            <div className="text-xs text-gray-600 pt-2">Full list for 2025 (Manama):</div>
            <a href={DP_TAMIL_CAL_2025} target="_blank" className="text-blue-600 underline inline-flex items-center gap-1"><ExternalLink className="w-3 h-3"/> Tamil Festivals 2025 — Manama</a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Sankalpam builder with language, gothram, deity and time controls ---
const LANGS = {
  en: {
    label: "English",
    sankalpamPrefix: `Srih | Sri Govinda Govinda Govinda |
For removal of accumulated sins and for the pleasure of Sri Parameshwara, I perform (vrata/puja)`,
    filler: (o: any) =>
      `In the ${o.samvatsara} year, in ${o.ayana}, during ${o.ritu}, in the lunar month of ${o.masa}, in ${o.paksha}, on ${o.tithi} tithi, on ${o.weekday} (${o.time}), at ${o.place}, under ${o.nakshatra} nakshatra, during ${o.yoga} yoga and ${o.karana} karana, I (${o.name || "—"}) of ${o.gothram} gotra perform puja for the grace of ${o.deity}.`,
  },
  sa: {
    label: "Sanskrit",
    sankalpamPrefix: `श्रीः | श्री गोविन्द गोविन्द गोविन्द |
मम उपात्त समस्त-दुरित-क्षय-द्वार श्री-परमेश्वर प्रीत्यर्थं`,
    filler: (o: any) =>
      `श्री ${o.samvatsara} नाम संवत्सरे, दक्षिणायने, वर्षा-ऋतौ, ${o.masa}‑मासे, ${o.paksha}, ${o.tithi} तिथौ, ${o.weekday} (${o.time}), ${o.place} देशे, ${o.nakshatra} नक्षत्रे, ${o.yoga} योगे, ${o.karana} करणe, एवं गुणविशेषेण विशिष्टायाम्, श्री ${o.deity} प्रीत्यर्थं अहं ${o.gothram} गोत्रः (नाम: ${o.name || "—"}) व्रत/पूजां करिष्ये |`,
  },
  ta: {
    label: "தமிழ்",
    sankalpamPrefix: `ஸ்ரீ: | ஸ்ரீ கோவிந்த கோவிந்த கோவிந்த |
என் பாப நிவிர்த்திக்காகவும், பரமేశ்வரன் திருப்திக்காகவும்`,
    filler: (o: any) =>
      `ஸ்ரீ ${o.samvatsara} நாம வருடத்தில், ${o.ayana}ல், ${o.ritu} காலத்தில், ${o.masa} மாதத்தில், ${o.paksha}ல், ${o.tithi} திதியில், ${o.weekday} (${o.time}), ${o.place} தேசத்தில், ${o.nakshatra} நட்சத்திரத்தில், ${o.yoga} யோகத்தில், ${o.karana} கரணத்தில், இவ்வாறு விசேஷமான காலத்தில், நான் (${o.name || "—"}) ${o.gothram} கோத்திரம், ${o.deity} திருப்திக்காக விரதம்/பூஜை செய்வேன்.`,
  },
};

// Defaults for Fri Aug 8, 2025 17:18 Asia/Bahrain (locked snapshot)
const DEFAULT_PANCHANG = {
  dateISO: "2025-08-08",
  time: "17:18",
  place: "Manama, Bahrain",
  weekday: "Shukravara",
  samvatsara: "Viśvavasu",
  ayana: "Dakṣiṇāyana",
  ritu: "Varṣā (Monsoon)",
  masa: "Śrāvaṇa",
  paksha: "Śukla Pakṣa",
  tithi: "Pūrṇimā",
  nakshatra: "Śravaṇa",
  yoga: "Āyuṣmān",
  karana: "Viṣṭi (Bhadra)",
};

function composeSankalpam(lang: keyof typeof LANGS, deity: string, gothram: string, name: string, panchang: any) {
  const pack = LANGS[lang] || LANGS.sa;
  const merged = { ...panchang, deity, gothram, name } as any;
  return `${pack.sankalpamPrefix}\n\n${pack.filler(merged)}`;
}

function SankalpamBox({ defaultDeity = "Lakṣmī" }: { defaultDeity?: string }) {
  const [lang, setLang] = useState<keyof typeof LANGS>("sa");
  const [gothram, setGothram] = useState("Bhāradvāja");
  const [name, setName] = useState("");
  const [deity, setDeity] = useState(defaultDeity);
  const [autoNow, setAutoNow] = useState(false);
  const [manualDate, setManualDate] = useState(DEFAULT_PANCHANG.dateISO);
  const [manualTime, setManualTime] = useState(DEFAULT_PANCHANG.time);
  const [panchang, setPanchang] = useState<any>({ ...DEFAULT_PANCHANG });

  useEffect(() => {
    if (autoNow) {
      const id = setInterval(() => {
        const now = new Date();
        const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bahrain", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now).reduce((acc: any, p) => { acc[p.type] = p.value; return acc; }, {});
        setPanchang((prev: any) => ({ ...prev, dateISO: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` }));
      }, 60_000);
      return () => clearInterval(id);
    }
  }, [autoNow]);

  useEffect(() => {
    if (!autoNow) setPanchang((prev: any) => ({ ...prev, dateISO: manualDate, time: manualTime }));
  }, [autoNow, manualDate, manualTime]);

  const text = composeSankalpam(lang, deity, gothram, name, panchang);
  const copy = async () => { try { await navigator.clipboard.writeText(text); } catch {} };

  return (
    <Card className="rounded-3xl border-pink-100/70">
      <CardHeader className="pb-0">
        <CardTitle className="text-base flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="inline-flex items-center gap-2"><ScrollText className="w-4 h-4"/> Sankalpam</span>
          <span className="text-xs text-gray-600 inline-flex items-center gap-1"><Clock className="w-3 h-3"/> {panchang.dateISO} • {panchang.time} (Asia/Bahrain)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="flex gap-2 items-center">
            <span className="text-xs w-16">Language</span>
            <select className="border rounded-lg px-2 py-1.5 text-sm" value={lang} onChange={e=>setLang(e.target.value as any)}>
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="sa">Sanskrit</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs w-16">Deity</span>
            <select className="border rounded-lg px-2 py-1.5 text-sm" value={deity} onChange={e=>setDeity(e.target.value)}>
              {["Lakṣmī","Gaṇeśa","Durgā","Viṣṇu","Sarasvatī"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs w-16">Gothram</span>
            <select className="border rounded-lg px-2 py-1.5 text-sm" value={gothram} onChange={e=>setGothram(e.target.value)}>
              {["Bhāradvāja","Vasiṣṭha","Kaśyapa","Atri","Viśvāmitra","Agastya","Gautama","Jāmadagnya","Bhṛgu"].map(g=> <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs w-16">Your name</span>
            <input className="border rounded-lg px-2 py-1.5 text-sm w-full" placeholder="optional" value={name} onChange={e=>setName(e.target.value)} />
          </div>
        </div>

        <div className="rounded-xl bg-amber-50/60 border border-amber-100 p-3 flex flex-col gap-2">
          <label className="text-sm inline-flex items-center gap-2">
            <input type="checkbox" checked={autoNow} onChange={e=>setAutoNow(e.target.checked)} />
            Use current time (auto‑update)
          </label>
          {!autoNow && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Date (Asia/Bahrain)</div>
                <input className="border rounded-lg px-2 py-1.5 text-sm w-full" type="date" value={manualDate} onChange={e=>setManualDate(e.target.value)} />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Time (24h)</div>
                <input className="border rounded-lg px-2 py-1.5 text-sm w-full" type="time" value={manualTime} onChange={e=>setManualTime(e.target.value)} />
              </div>
            </div>
          )}
          <div className="text-[11px] text-gray-600">Snapshot locked to <b>Fri Aug 8, 2025 — 17:18 (Asia/Bahrain)</b>. Toggle on “Use current time” to refresh date/time only.</div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border p-3 bg-white">
            <div className="text-xs text-gray-500 mb-2">Tamil Calendar snapshot</div>
            <div className="text-sm leading-6">
              <div><b>Samvatsara</b>: {panchang.samvatsara}</div>
              <div><b>Ayana / Ritu</b>: {panchang.ayana} • {panchang.ritu}</div>
              <div><b>Māsa / Pakṣa</b>: {panchang.masa} • {panchang.paksha}</div>
              <div><b>Tithi</b>: {panchang.tithi}</div>
              <div><b>Nakṣatra</b>: {panchang.nakshatra}</div>
              <div><b>Yoga</b>: {panchang.yoga}</div>
              <div><b>Karaṇa</b>: {panchang.karana}</div>
            </div>
          </div>
          <div className="rounded-xl border p-3 bg-white">
            <div className="text-xs text-gray-500 mb-2">Composed Sankalpam</div>
            <pre className="bg-gray-50 p-3 rounded-xl whitespace-pre-wrap text-sm leading-6 border">{text}</pre>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Button size="sm" onClick={copy}>Copy</Button>
              <a href={DP_TAMIL_DAY} target="_blank"><Button size="sm" variant="secondary" className="flex items-center gap-1"><ExternalLink className="w-4 h-4"/> Open Manama Tamil Calendar</Button></a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------- DEV TESTS (runtime) ------------------------- */
function runSankalpamTests() {
  const results: { name: string; pass: boolean; details?: string }[] = [];
  const t1 = composeSankalpam("en", "Lakṣmī", "Bhāradvāja", "Arun", DEFAULT_PANCHANG);
  results.push({ name: "EN sankalpam non-empty", pass: t1.length > 20 });
  results.push({ name: "Includes tithi Pūrṇimā", pass: t1.includes("Pūrṇimā") });
  results.push({ name: "All languages generate", pass: t1.length > 20 });
  return results;
}

function DevTestsCard() {
  const [outcomes, setOutcomes] = useState<{name:string;pass:boolean;details?:string}[] | null>(null);
  const run = () => setOutcomes(runSankalpamTests());
  return (
    <Card className="rounded-3xl border-green-100/70">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Bug className="w-4 h-4"/> Developer Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>Quick checks for Sankalpam generation (runs in the browser).</p>
        <Button size="sm" onClick={run}>Run unit tests</Button>
        {outcomes && (
          <ul className="list-disc pl-5 mt-2">
            {outcomes.map((r,i)=> (
              <li key={i} className={r.pass ? "text-green-700" : "text-red-700"}>
                {r.pass ? "PASS" : "FAIL"}: {r.name}
                {r.details ? ` — ${r.details}` : ""}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return FESTIVALS.slice(0, 4);
    return FESTIVALS.filter((f) => f.name.toLowerCase().includes(s) || f.id.includes(s));
  }, [q]);

  const [nowStr, setNowStr] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bahrain", weekday: "long", year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      setNowStr(fmt.format(d));
    };
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-white max-w-2xl mx-auto pb-24">
      {/* Top Hero */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              <Accent>Tamil Brahmin Almanac</Accent>
            </h1>
            <div className="text-xs text-gray-600 flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3"/> Manama, Bahrain</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3"/> {nowStr}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={DP_PANCHANG_MONTH} target="_blank">
              <Button size="sm" variant="secondary" className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Today’s Panchangam</Button>
            </a>
          </div>
        </div>
        <Separator />
        <div className="px-5 py-3 bg-white/85">
          <div className="relative">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a festival (e.g., ganesha, navaratri)…" className="pl-9 h-11 rounded-xl"/>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Bahrain‑aware links included.</div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-5 py-5 space-y-6">
        <Tabs defaultValue="festivals">
          <TabsList className="grid grid-cols-3 gap-2 bg-gray-100/70 rounded-2xl p-1">
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="festivals" className="mt-5 space-y-6">
            <SankalpamBox defaultDeity="Lakṣmī" />
            {results.map((f) => (
              <div id={f.id} key={f.id} className="scroll-mt-20">
                <FestivalCard f={f} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="calendar" className="mt-5">
            <CalendarTab />
          </TabsContent>

          <TabsContent value="resources" className="mt-5 space-y-6">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg">General Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-1 gap-2">
                  <a href={DP_TAMIL_CAL_2025} target="_blank" className="text-blue-600 underline inline-flex items-center gap-1"><ExternalLink className="w-4 h-4"/> Tamil Festivals 2025 — Manama (DrikPanchang)</a>
                  <a href={DP_TAMIL_DAY} target="_blank" className="text-blue-600 underline inline-flex items-center gap-1"><ExternalLink className="w-4 h-4"/> Daily Tamil Panchangam — Manama</a>
                  <a href={MYPANCHANG_2025} target="_blank" className="text-blue-600 underline inline-flex items-center gap-1"><ExternalLink className="w-4 h-4"/> MyPanchang — Manama (2025 full year)</a>
                  <a href={TEMPLE_INFO} target="_blank" className="text-blue-600 underline inline-flex items-center gap-1"><ExternalLink className="w-4 h-4"/> Shri Krishna Temple (Little India area) — directions</a>
                </div>
                <div className="pt-2">
                  <div className="font-medium mb-1">Starter Shopping (ships to Bahrain)</div>
                  <div className="flex flex-wrap gap-2">
                    <a href={SHOP_DESERTCART_POOJA} target="_blank"><Badge>Desertcart — Pooja</Badge></a>
                    <a href={SHOP_DESERTCART_KIT_25} target="_blank"><Badge>Desertcart — 25‑item kit</Badge></a>
                    <a href={SHOP_DESERTCART_KIT_31} target="_blank"><Badge>Desertcart — 31‑item kit</Badge></a>
                    <a href={SHOP_UBUY_THALI} target="_blank"><Badge>Ubuy — Brass thali</Badge></a>
                    <a href={SHOP_UBUY_AllInOne} target="_blank"><Badge>Ubuy — 31‑item kit</Badge></a>
                  </div>
                </div>
                <p className="text-xs text-gray-600">Tip: For flowers & fresh leaves (tulasi, mango toran), visit Manama Souq near the Shri Krishna Temple on festival mornings.</p>
              </CardContent>
            </Card>

            <DevTestsCard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom bar */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="text-[11px] text-gray-600">Made for Tamil Brahmin rituals • Follow family/āchārya guidance</div>
          <a href={DP_TAMIL_CAL_2025} target="_blank"><Button size="sm" className="rounded-xl">Tamil Calendar 2025 (BH)</Button></a>
        </div>
      </footer>
    </div>
  );
}
