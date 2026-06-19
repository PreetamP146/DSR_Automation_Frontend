"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDsrActivity, useGenerateDsr } from "@/hooks/use-dsr";
import { getErrorMessage, todayISO } from "@/lib/utils";
import type { DSRReport } from "@/types";

export default function GenerateDsrPage() {
  const router = useRouter();
  const [reportDate, setReportDate] = useState(todayISO());
  const [preview, setPreview] = useState<DSRReport | null>(null);
  const [edited, setEdited] = useState<Partial<DSRReport>>({});

  const { data: activityPreview, refetch: loadActivity } = useDsrActivity(reportDate);
  const generateDsr = useGenerateDsr();

  const handlePreviewActivity = () => loadActivity();

  const handleGenerate = async () => {
    try {
      const result = await generateDsr.mutateAsync({ report_date: reportDate });
      setPreview(result.report);
      setEdited(result.report);
      toast.success("DSR generated successfully");
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const handleViewReport = () => {
    if (preview?.id) router.push(`/dsr/${preview.id}`);
  };

  const copyToClipboard = () => {
    if (!preview) return;
    const text = [
      `Yesterday: ${edited.yesterday_work ?? preview.yesterday_work}`,
      `Today: ${edited.today_plan ?? preview.today_plan}`,
      `Blockers: ${edited.blockers ?? preview.blockers}`,
      `Summary: ${edited.summary ?? preview.summary}`,
    ].join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("DSR copied to clipboard (submitted)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate DSR</h1>
        <p className="text-muted-foreground">AI-powered daily status report from your activity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select date and preview activity before generating</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xs space-y-2">
            <Label htmlFor="report_date">Report Date</Label>
            <Input
              id="report_date"
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handlePreviewActivity}>
              Preview Activity
            </Button>
            <Button onClick={handleGenerate} disabled={generateDsr.isPending}>
              <Sparkles className="h-4 w-4" />
              {generateDsr.isPending ? "Generating..." : "Generate DSR"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {activityPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Badge>{activityPreview.total_remote_commits} remote commits</Badge>
            <Badge variant="secondary">{activityPreview.total_local_commits} local commits</Badge>
            <Badge variant="outline">{activityPreview.total_planning_events} planning events</Badge>
          </CardContent>
        </Card>
      )}

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>DSR Preview</CardTitle>
            <CardDescription>Edit before submitting. Saving is handled on generate via backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Yesterday&apos;s Work</Label>
              <Textarea
                rows={4}
                value={edited.yesterday_work ?? preview.yesterday_work}
                onChange={(e) => setEdited({ ...edited, yesterday_work: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Today&apos;s Plan</Label>
              <Textarea
                rows={4}
                value={edited.today_plan ?? preview.today_plan}
                onChange={(e) => setEdited({ ...edited, today_plan: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Blockers</Label>
              <Textarea
                rows={3}
                value={edited.blockers ?? preview.blockers}
                onChange={(e) => setEdited({ ...edited, blockers: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea
                rows={4}
                value={edited.summary ?? preview.summary}
                onChange={(e) => setEdited({ ...edited, summary: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleViewReport}>
                View saved report
              </Button>
              <Button onClick={copyToClipboard}>Submit / Copy DSR</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Backend has no update endpoint yet. Edits are local until copy/submit. Re-generate to persist changes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
