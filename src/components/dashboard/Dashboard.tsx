import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface DashboardProps {
  user: any;
  enrollments: any[];
  onSelectSubject: (subject: any) => void;
}

export const Dashboard = ({ user, enrollments, onSelectSubject }: DashboardProps) => {
  const mockProgress = {
    completedLessons: 12,
    totalLessons: 45,
    avgScore: 85,
    streak: 7
  };

  const mockRecentActivity = [
    { id: 1, subject: "Mathematics", lesson: "Algebra Basics", score: 90, completedAt: "2 hours ago" },
    { id: 2, subject: "Science", lesson: "Chemical Reactions", score: 85, completedAt: "1 day ago" },
    { id: 3, subject: "Language Arts", lesson: "Creative Writing", score: 95, completedAt: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Header */}
      <div className="bg-gradient-primary text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.first_name}! 👋
          </h1>
          <p className="text-blue-100">
            Ready to continue your learning journey?
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">{Math.round((mockProgress.completedLessons / mockProgress.totalLessons) * 100)}%</p>
                </div>
                <div className="text-2xl">📈</div>
              </div>
              <Progress value={(mockProgress.completedLessons / mockProgress.totalLessons) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">{mockProgress.avgScore}%</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="text-2xl font-bold">{mockProgress.completedLessons}/{mockProgress.totalLessons}</p>
                </div>
                <div className="text-2xl">📚</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold">{mockProgress.streak} days</p>
                </div>
                <div className="text-2xl">🔥</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrolled Subjects */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Subjects</h2>
            <div className="space-y-4">
              {enrollments.map((subject, index) => (
                <Card 
                  key={subject.id} 
                  className="shadow-soft hover:shadow-medium transition-all duration-200 cursor-pointer"
                  onClick={() => onSelectSubject(subject)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{subject.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{subject.description}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">
                            {subject.grade_level}
                          </Badge>
                          <Badge variant="outline">
                            {subject.language}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Progress: {20 + (index * 25)}% complete
                          </div>
                          <Button variant="outline" size="sm">
                            Continue Learning
                          </Button>
                        </div>
                        
                        <Progress value={20 + (index * 25)} className="mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.lesson}</p>
                        <p className="text-sm text-muted-foreground">{activity.subject}</p>
                        <p className="text-xs text-muted-foreground">{activity.completedAt}</p>
                      </div>
                      <Badge variant={activity.score >= 90 ? "default" : activity.score >= 80 ? "secondary" : "outline"}>
                        {activity.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-soft mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump back into your learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    📝 Take a Practice Quiz
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📖 Review Past Lessons
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🎯 View Learning Goals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};