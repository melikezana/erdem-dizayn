"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { createProjectCodeShareWhatsAppUrl } from "@/lib/contact";

type AdminProjectCodeActionsProps = {
  projectCode: string;
  customerPhone: string | null;
};

export function AdminProjectCodeActions({
  projectCode,
  customerPhone,
}: AdminProjectCodeActionsProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const whatsappUrl = useMemo(() => {
    if (!customerPhone) {
      return null;
    }

    return createProjectCodeShareWhatsAppUrl(projectCode, customerPhone);
  }, [customerPhone, projectCode]);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const copyCode = async () => {
    await navigator.clipboard.writeText(projectCode);
    setCopied(true);

    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
    }

    resetTimer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={copyCode}
        className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-white px-6 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span>{copied ? "Kopyalandı" : "Kodu Kopyala"}</span>
      </button>

      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#102B49] px-6 text-sm font-semibold text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp ile Gönder</span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          title="WhatsApp göndermek için müşteri telefonu gerekir."
          className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#102B49]/45 px-6 text-sm font-semibold text-[#F6F2EA]"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp ile Gönder</span>
        </button>
      )}
    </div>
  );
}
