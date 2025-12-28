"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Check, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  pdf,
  PDFDownloadLink, 
  Font 
} from "@react-pdf/renderer";

// --- 1. DEFINE PDF STYLES (Professional Business Format) ---
// Use Times-Roman (classic serif) with 1" margins (72pt) and readable 12pt size
const styles = StyleSheet.create({
  page: {
    padding: 72, // 1 inch margins
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.4,
    color: "#222222",
  },
  header: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
    paddingBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  contact: {
    fontSize: 10,
    color: "#555555",
    flexDirection: "row",
    gap: 8,
  },
  recipientBlock: {
    marginTop: 26,
    marginBottom: 18,
  },
  date: {
    fontSize: 11,
    marginBottom: 12,
  },
  body: {
    marginTop: 8,
    textAlign: "justify",
  },
  paragraph: {
    marginBottom: 10,
    textIndent: 0,
  },
  signature: {
    marginTop: 36,
  }
});

// --- 2. THE PDF DOCUMENT STRUCTURE ---
const CoverLetterPDFDocument = ({ letter, user }) => {
  // Convert common HTML (br, p) into plain text while preserving paragraph breaks
  const htmlToText = (html = "") =>
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>\s*<p>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\u00A0/g, " ")
      .trim();

  const cleanText = htmlToText(letter?.generatedContent || "");
  const paragraphs = cleanText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header: Name & Contact */}
        <View style={styles.header}>
          <Text style={styles.name}>{user?.name || "Candidate Name"}</Text>
          <Text style={styles.contact}>
            {user?.email} • {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Recipient Details */}
        <View style={styles.recipientBlock}>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          <Text>Hiring Manager</Text>
          <Text style={{ fontFamily: "Times-Bold", marginTop: 2 }}>{letter.companyName}</Text>
          <Text>Re: Application for {letter.jobTitle}</Text>
        </View>

        {/* Body Content */}
        <View style={styles.body}>
           <Text style={{ marginBottom: 10 }}>Dear Hiring Manager,</Text>
           
           {paragraphs.map((para, i) => (
             <Text key={i} style={styles.paragraph}>
               {para}
             </Text>
           ))}
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text>Sincerely,</Text>
          <Text style={{ marginTop: 30, fontFamily: "Times-Bold" }}>{user?.name}</Text>
        </View>

      </Page>
    </Document>
  );
};

// --- 3. MAIN COMPONENT ---
export const CoverLetterView = ({ letter, user }) => {
  const [isClient, setIsClient] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Fix hydration issues by waiting for client load
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopy = () => {
    const text = letter.generatedContent.replace(/<[^>]+>/g, "\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true);
      const doc = <CoverLetterPDFDocument letter={letter} user={user} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = `${(user?.name || "Candidate").replace(/\s+/g, "_")}_${(letter.jobTitle||"CoverLetter").replace(/\s+/g, "_")}_${(letter.companyName||"Company").replace(/\s+/g,"_")}.pdf`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* --- TOP TOOLBAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0F121C] border border-white/10 shadow-lg">
        <Link href="/dashboard/cover-letter">
          <Button variant="ghost" className="text-slate-400 hover:text-white gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy} 
            className="gap-2 bg-transparent border-white/20 text-slate-300 hover:bg-white/5 hover:text-white"
          >
             {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
             Copy Text
          </Button>

          {/* PDF DOWNLOAD BUTTON */}
          {isClient && (
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              {pdfLoading ? "Preparing PDF..." : "Download Professional PDF"}
            </Button>
          )}
        </div>
      </div>

      {/* --- WEB PREVIEW (A4 Paper Look) --- */}
      <div className="flex justify-center py-8 px-4 bg-[#1a1f2e]/50 rounded-3xl border border-white/5 overflow-hidden">
        
        {/* The White Paper */}
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[25mm] shadow-2xl mx-auto flex flex-col font-serif">
            
            {/* Header */}
            <header className="mb-8 border-b-2 border-slate-800 pb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900">
                    {user?.name || "Your Name"}
                </h1>
                <div className="mt-2 text-sm text-slate-600 flex flex-wrap gap-4 font-sans">
                    <span>{user?.email}</span>
                </div>
            </header>

            {/* Recipient Info */}
            <div className="mb-8 text-sm text-slate-700 leading-relaxed font-sans">
                <p className="font-bold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <br />
                <p>Hiring Manager</p>
                <p className="font-bold text-slate-900">{letter.companyName}</p>
                <p className="italic">Re: Application for {letter.jobTitle}</p>
            </div>

            {/* Content Body */}
            <div 
                className="prose prose-slate max-w-none text-[11pt] leading-7 text-slate-800 whitespace-pre-line text-justify font-serif"
                dangerouslySetInnerHTML={{ __html: letter.generatedContent }} 
            />

            {/* Signature Area */}
            <div className="mt-12 pt-8">
                <p className="text-slate-800 font-serif">Sincerely,</p>
                <br />
                <br />
                <p className="font-bold text-lg text-slate-900 font-serif">{user?.name}</p>
            </div>
        </div>
      </div>

    </div>
  );
};