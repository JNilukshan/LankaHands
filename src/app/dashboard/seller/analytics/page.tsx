"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, DollarSign, TrendingUp, Users, ShoppingBag, Eye, Percent, Package } from 'lucide-react'; // Added Package back, it's valid
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'; 
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Legend, Tooltip } from 'recharts'; 

// Mock data for analytics
const totalSales = 12560.75;
const averageOrderValue = 85.20;
const conversionRate = 3.5;
const totalOrders = 148;
const uniqueVisitors = 2340;
const topSellingProduct = "Ocean Breeze Batik Saree";

const salesData = [
  { month: 'Jan', sales: 1200 },
  { month: 'Feb', sales: 1800 },
  { month: 'Mar', sales: 1500 },
  { month: 'Apr', sales: 2200 },
  { month: 'May', sales: 2500 },
  { month: 'Jun', sales: 3100 },
];

const chartConfig = {
  sales: {
    label: "Sales ($)",
    color: "hsl(var(--primary))",
  },
};

interface StatDisplayCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description?: string;
  iconColor?: string;
}

const StatDisplayCard: React.FC<StatDisplayCardProps> = ({ icon: Icon, title, value, description, iconColor = "text-accent" }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">{value}</div>
      {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
    </CardContent>
  </Card>
);

export default function SalesAnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
        <BarChart3 size={32} className="mr-3 text-accent" /> Sales Analytics
      </h1>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatDisplayCard icon={DollarSign} title="Total Revenue" value={`$${totalSales.toLocaleString()}`} description="All-time gross revenue" />
        <StatDisplayCard icon={ShoppingBag} title="Total Orders" value={totalOrders.toString()} description="Completed transactions" />
        <StatDisplayCard icon={TrendingUp} title="Average Order Value" value={`$${averageOrderValue.toFixed(2)}`} description="Per transaction average" />
        <StatDisplayCard icon={Eye} title="Unique Visitors" value={uniqueVisitors.toLocaleString()} description="Past 30 days" iconColor="text-blue-500" />
        <StatDisplayCard icon={Percent} title="Conversion Rate" value={`${conversionRate.toFixed(1)}%`} description="Visitors who purchased" iconColor="text-green-500" />
         <StatDisplayCard icon={Package} title="Top Selling Product" value={topSellingProduct} description="Most units sold" iconColor="text-purple-500" />
      </div>

      {/* Sales Trend Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">Monthly Sales Trend</CardTitle>
          <CardDescription>Track your sales performance over the past six months.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Placeholder for other charts/data tables */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-headline text-primary">More Analytics Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed reports on customer demographics, traffic sources, and product performance will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
