"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 372, mobile: 1 },
  { date: "2024-04-09", desktop: 301, mobile: 100 },
  { date: "2024-04-10", desktop: 245, mobile: 180 },
  { date: "2024-04-11", desktop: 372, mobile: 1 },
  { date: "2024-04-12", desktop: 301, mobile: 100 },
  { date: "2024-04-13", desktop: 245, mobile: 180 },
  { date: "2024-04-14", desktop: 372, mobile: 1 },
  { date: "2024-04-15", desktop: 301, mobile: 100 },
  { date: "2024-04-16", desktop: 245, mobile: 180 },
  { date: "2024-04-17", desktop: 372, mobile: 1 },
  { date: "2024-04-18", desktop: 301, mobile: 100 },
  { date: "2024-04-19", desktop: 245, mobile: 180 },
  { date: "2024-04-20", desktop: 372, mobile: 1 },
  { date: "2024-04-21", desktop: 301, mobile: 100 },
  { date: "2024-04-22", desktop: 245, mobile: 180 },
  { date: "2024-04-23", desktop: 372, mobile: 1 },
  { date: "2024-04-24", desktop: 301, mobile: 100 },
  { date: "2024-04-25", desktop: 245, mobile: 180 },
  { date: "2024-04-26", desktop: 372, mobile: 1 },
  { date: "2024-04-27", desktop: 301, mobile: 100 },
  { date: "2024-04-28", desktop: 245, mobile: 180 },
  { date: "2024-04-29", desktop: 372, mobile: 1 },
  { date: "2024-04-30", desktop: 301, mobile: 100 },
  { date: "2024-05-01", desktop: 245, mobile: 180 },
  { date: "2024-05-02", desktop: 372, mobile: 1 },
  { date: "2024-05-03", desktop: 301, mobile: 100 },
  { date: "2024-05-04", desktop: 245, mobile: 180 },
  { date: "2024-05-05", desktop: 372, mobile: 1 },
  { date: "2024-05-06", desktop: 301, mobile: 100 },
  { date: "2024-05-07", desktop: 245, mobile: 180 },
  { date: "2024-05-08", desktop: 372, mobile: 1 },
  { date: "2024-05-09", desktop: 301, mobile: 100 },
  { date: "2024-05-10", desktop: 245, mobile: 180 },
  { date: "2024-05-11", desktop: 372, mobile: 1 },
  { date: "2024-05-12", desktop: 301, mobile: 100 },
  { date: "2024-05-13", desktop: 245, mobile: 180 },
  { date: "2024-05-14", desktop: 372, mobile: 1 },
  { date: "2024-05-15", desktop: 301, mobile: 100 },
  { date: "2024-05-16", desktop: 245, mobile: 180 },
  { date: "2024-05-17", desktop: 372, mobile: 1 },
  { date: "2024-05-18", desktop: 301, mobile: 100 },
  { date: "2024-05-19", desktop: 245, mobile: 180 },
  { date: "2024-05-20", desktop: 372, mobile: 1 },
  { date: "2024-05-21", desktop: 301, mobile: 100 },
  { date: "2024-05-22", desktop: 245, mobile: 180 },
  { date: "2024-05-23", desktop: 372, mobile: 1 },
  { date: "2024-05-24", desktop: 301, mobile: 100 },
  { date: "2024-05-25", desktop: 245, mobile: 180 },
  { date: "2024-05-26", desktop: 372, mobile: 1 },
  { date: "2024-05-27", desktop: 301, mobile: 100 },
  { date: "2024-05-28", desktop: 245, mobile: 180 },
  { date: "2024-05-29", desktop: 372, mobile: 1 },
  { date: "2024-05-30", desktop: 301, mobile: 100 },
  { date: "2024-05-31", desktop: 245, mobile: 180 },
  { date: "2024-06-01", desktop: 372, mobile: 1 },
  { date: "2024-06-02", desktop: 301, mobile: 100 },
  { date: "2024-06-03", desktop: 245, mobile: 180 },
  { date: "2024-06-04", desktop: 372, mobile: 1 },
  { date: "2024-06-05", desktop: 301, mobile: 100 },
  { date: "2024-06-06", desktop: 245, mobile: 180 },
  { date: "2024-06-07", desktop: 372, mobile: 1 },
  { date: "2024-06-08", desktop: 301, mobile: 100 },
  { date: "2024-06-09", desktop: 245, mobile: 180 },
  { date: "2024-06-10", desktop: 372, mobile: 1 },
  { date: "2024-06-11", desktop: 301, mobile: 100 },
  { date: "2024-06-12", desktop: 245, mobile: 180 },
  { date: "2024-06-13", desktop: 372, mobile: 1 },
  { date: "2024-06-14", desktop: 301, mobile: 100 },
  { date: "2024-06-15", desktop: 245, mobile: 180 },
  { date: "2024-06-16", desktop: 372, mobile: 1 },
  { date: "2024-06-17", desktop: 301, mobile: 100 },
  { date: "2024-06-18", desktop: 245, mobile: 180 },
  { date: "2024-06-19", desktop: 372, mobile: 1 },
  { date: "2024-06-20", desktop: 301, mobile: 100 },
  { date: "2024-06-21", desktop: 245, mobile: 180 },
  { date: "2024-06-22", desktop: 372, mobile: 1 },
  { date: "2024-06-23", desktop: 301, mobile: 100 },
  { date: "2024-06-24", desktop: 245, mobile: 180 },
  { date: "2024-06-25", desktop: 372, mobile: 1 },
  { date: "2024-06-26", desktop: 301, mobile: 100 },
  { date: "2024-06-27", desktop: 245, mobile: 180 },
  { date: "2024-06-28", desktop: 372, mobile: 1 },
  { date: "2024-06-29", desktop: 301, mobile: 100 },
  { date: "2024-06-30", desktop: 245, mobile: 180 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[--chart-height] w-full max-w-full"
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex flex-wrap gap-4 pt-4">
          <ToggleGroup
            type="multiple"
            variant="outline"
            value={["desktop", "mobile"]}
            className="justify-start"
          >
            <ToggleGroupItem value="desktop" variant="outline">
              <div
                className="mr-2 h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: "var(--color-desktop)",
                }}
              />
              Desktop
            </ToggleGroupItem>
            <ToggleGroupItem value="mobile" variant="outline">
              <div
                className="mr-2 h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: "var(--color-mobile)",
                }}
              />
              Mobile
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  )
}


































