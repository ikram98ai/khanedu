import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLessons, useSubject } from "@/hooks/useApiQueries";
import { ArrowLeft, BookOpen, Clock, CheckCircle } from "lucide-react";
import { AIAssistant } from "@/components/learning/AIAssistant";

interface SubjectDetailProps {
  subjectId: number;
  onBack: () => void;
  onLessonSelect: (subjectId: number, lessonId: number) => void;
}

export const SubjectDetail = ({ subjectId, onBack, onLessonSelect }: SubjectDetailProps) => {
  const { data: subject, isLoading: subjectLoading } = useSubject(subjectId);
  const { data: lessons, isLoading: lessonsLoading } = useLessons(subjectId);

  const isLoading = subjectLoading || lessonsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Subject not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const publishedLessons = lessons?.filter(lesson => lesson.status === 'PU') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Button onClick={onBack} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subjects
        </Button>

        <Card className="border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">{subject.name}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {subject.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                Grade {subject.grade_level}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Available Lessons</h2>
            <Badge variant="outline">
              {publishedLessons.length} lesson{publishedLessons.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {publishedLessons.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No lessons available yet</p>
                <p className="text-muted-foreground">
                  Lessons for this subject are being prepared. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {publishedLessons.map((lesson, index) => (
                <Card 
                  key={lesson.id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-card to-card/80"
                  onClick={() => onLessonSelect(subjectId, lesson.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {lesson.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(lesson.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {lesson.verified_at && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant={lesson.status === 'PU' ? 'default' : 'secondary'}>
                        {lesson.status === 'PU' ? 'Published' : 'Draft'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        By {lesson.instructor}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <AIAssistant subject={subject?.name} />
    </div>
  );
};