import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { SmartSearch } from "@/components/search/SmartSearch";
import { AIAssistant } from "@/components/learning/AIAssistant";
import { ProgressAnalytics } from "@/components/learning/ProgressAnalytics";
import { useStudentDashboard, useSubjects } from "@/hooks/useApiQueries";
import { useAuth } from "@/providers/AuthProvider";
import { SubjectDetail } from "@/components/subjects/SubjectDetail";
import { LessonDetail } from "@/components/lessons/LessonDetail";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{ subjectId: number; lessonId: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user, profile, logout } = useAuth();
  const { data: dashboardData, isLoading: dashboardLoading } = useStudentDashboard();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects({
    grade_level: profile?.current_grade ? parseInt(profile.current_grade.replace('GR', '')) : undefined,
    language: profile?.language,
    search: searchQuery || undefined
  });

  const handleSubjectSelect = (subjectId: number) => {
    setSelectedSubject(subjectId);
    setSelectedLesson(null);
  };

  const handleLessonSelect = (subjectId: number, lessonId: number) => {
    setSelectedLesson({ subjectId, lessonId });
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedLesson(null);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  const isLoading = dashboardLoading || subjectsLoading;

  // Render lesson detail view
  if (selectedLesson) {
    return (
      <LessonDetail
        subjectId={selectedLesson.subjectId}
        lessonId={selectedLesson.lessonId}
        onBack={handleBackToLessons}
      />
    );
  }

  // Render subject detail view
  if (selectedSubject) {
    return (
      <SubjectDetail
        subjectId={selectedSubject}
        onBack={handleBackToSubjects}
        onLessonSelect={handleLessonSelect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">EduPlatform</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.first_name || 'Student'}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <SmartSearch 
                onSelectResult={(result) => {
                  if (result.type === 'subject') {
                    handleSubjectSelect(parseInt(result.id));
                  }
                }}
                placeholder="Search subjects, lessons..."
              />
              <Link to="/profile">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="subjects" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects">My Subjects</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-8 bg-muted rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subjects?.map((subject) => (
                  <Card key={subject.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-card to-card/80">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{subject.name}</CardTitle>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Grade {subject.grade_level}
                        </Badge>
                      </div>
                      <CardDescription>{subject.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                        variant="outline"
                        onClick={() => handleSubjectSelect(subject.id)}
                      >
                        View Lessons
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressAnalytics />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.recent_attempts && dashboardData.recent_attempts.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent_attempts.map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Quiz Attempt</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(attempt.end_time).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={attempt.passed ? "default" : "secondary"}>
                          {attempt.score.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent activity yet</p>
                    <p className="text-sm text-muted-foreground">Start learning to see your activity here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};