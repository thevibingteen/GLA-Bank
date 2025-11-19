import Sidebar from '@/components/dashboard/Sidebar';
import PageHeader from '@/components/dashboard/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, TrendingUp, TrendingDown, DollarSign, PieChart, Target, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const categories = [
    { name: 'Food & Dining', amount: 0, color: 'bg-orange-500' },
    { name: 'Shopping', amount: 0, color: 'bg-purple-500' },
    { name: 'Transportation', amount: 0, color: 'bg-yellow-500' },
    { name: 'Utilities', amount: 0, color: 'bg-blue-500' },
    { name: 'Entertainment', amount: 0, color: 'bg-pink-500' },
    { name: 'Healthcare', amount: 0, color: 'bg-red-500' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20 dark:bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <PageHeader
          title="Analytics"
          description="Monitor spending, income, and savings trends across all accounts."
          tag="Insights"
          actions={
            <>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export data
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-violet-600 to-blue-500">
                <Sparkles className="h-4 w-4" />
                Generate report
              </Button>
            </>
          }
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net savings</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{formatCurrency(0)}</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Savings rate</CardTitle>
                  <PieChart className="h-4 w-4 text-fuchsia-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">0%</p>
                  <p className="text-xs text-muted-foreground">Of income saved</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Smart budgeting tips</CardTitle>
                <CardDescription>Insights appear here once spending data is available.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                <p>
                  Connect more accounts or start transferring funds to unlock AI-powered recommendations for saving more every
                  month.
                </p>
                <Button variant="outline" className="gap-2">
                  <Target className="h-4 w-4" />
                  Set savings goal
                </Button>
              </CardContent>
            </Card>

            <Tabs defaultValue="spending" className="space-y-4">
              <TabsList>
                <TabsTrigger value="spending">Spending</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="spending" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by category</CardTitle>
                    <CardDescription>Compare your top categories and watch for unusual activity.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${category.color}`} />
                            <span>{category.name}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(category.amount)}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className={`h-full rounded-full ${category.color}`} style={{ width: '0%' }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly comparison</CardTitle>
                    <CardDescription>See growth once you start generating transactions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                      <PieChart className="mb-3 h-12 w-12 opacity-50" />
                      <p>No spending data yet</p>
                      <p className="text-sm">Start transacting to unlock charts and benchmarks.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="income">
                <Card>
                  <CardHeader>
                    <CardTitle>Income sources</CardTitle>
                    <CardDescription>Salary, business, passive income streams</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                      <TrendingUp className="mb-3 h-12 w-12 opacity-50" />
                      <p>No income data available</p>
                      <p className="text-sm">Income transactions will appear here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends">
                <Card>
                  <CardHeader>
                    <CardTitle>6-month trend</CardTitle>
                    <CardDescription>We show cash flow history once data is available.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                      <TrendingUp className="mb-3 h-12 w-12 opacity-50" />
                      <p>No trend data available</p>
                      <p className="text-sm">Historical data will be displayed here.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
