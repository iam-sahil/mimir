import React from "react";
import { Model } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, MessageSquare, AlertTriangle, Zap } from "lucide-react";
import { hasReachedDailyLimit, getFallbackModel } from "@/lib/models";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

interface ModelRateLimitsProps {
  model: Model;
}

export function ModelRateLimits({ model }: ModelRateLimitsProps) {
  if (!model.rateLimits || !model.usageTracking) {
    return null;
  }

  const { requestsPerDay, tokensPerDay, requestsPerMinute, tokensPerMinute } =
    model.rateLimits;
  const { requestsToday, tokensToday } = model.usageTracking;

  const requestsPercentage = Math.min(
    Math.round((requestsToday / requestsPerDay) * 100),
    100
  );

  const tokensPercentage = Math.min(
    Math.round((tokensToday / tokensPerDay) * 100),
    100
  );

  const isRequestsNearLimit = requestsPercentage > 80;
  const isTokensNearLimit = tokensPercentage > 80;

  const hasReachedLimit = hasReachedDailyLimit(model.id);
  const fallbackModel = hasReachedLimit ? getFallbackModel(model.id) : null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Rate Limits</CardTitle>
        <CardDescription>Current usage for {model.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasReachedLimit && fallbackModel && (
          <div className="flex items-start gap-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md text-sm mb-4">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-700 dark:text-yellow-300">
                Daily limit reached
              </p>
              <p className="text-yellow-600 dark:text-yellow-400">
                Using {fallbackModel.name} as fallback model
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>Requests (Daily)</span>
            </div>
            <span
              className={cn(isRequestsNearLimit && "text-red-500 font-medium")}
            >
              {requestsToday} / {requestsPerDay}
            </span>
          </div>
          <Progress
            value={requestsPercentage}
            className={cn("h-2", isRequestsNearLimit && "text-red-500")}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Tokens (Daily)</span>
            </div>
            <span
              className={cn(isTokensNearLimit && "text-red-500 font-medium")}
            >
              {tokensToday.toLocaleString()} / {tokensPerDay.toLocaleString()}
            </span>
          </div>
          <Progress
            value={tokensPercentage}
            className={cn("h-2", isTokensNearLimit && "text-red-500")}
          />
        </div>

        <Separator className="my-2" />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Per Minute Limits</h4>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>RPM: {requestsPerMinute}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>TPM: {tokensPerMinute?.toLocaleString() || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2 pt-1 border-t border-border">
          <p>Limits reset daily at midnight UTC</p>
          <p className="mt-1">Daily limits are tracked in your browser</p>
        </div>
      </CardContent>
    </Card>
  );
}
