import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLesson, useQuizzes, usePracticeTasks, useSubmitQuiz, useSubject } from "@/hooks/useApiQueries";
import { ArrowLeft, BookOpen, Brain, Trophy, CheckCircle, X } from "lucide-react";
import { AIAssistant } from "@/components/learning/AIAssistant";

interface LessonDetailProps {
  subjectId: number;
  lessonId: number;
  onBack: () => void;
}

export const LessonDetail = ({ subjectId, lessonId, onBack }: LessonDetailProps) => {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);

  const { data: lesson, isLoading: lessonLoading } = useLesson(subjectId, lessonId);
  const { data: subject } = useSubject(subjectId);
  const { data: quizzes, isLoading: quizzesLoading } = useQuizzes(subjectId, lessonId);
  const { data: practiceTasks, isLoading: tasksLoading } = usePracticeTasks(subjectId, lessonId);
  const submitQuizMutation = useSubmitQuiz();

  const isLoading = lessonLoading || quizzesLoading || tasksLoading;

  const handleQuizAnswer = (questionId: number, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleQuizSubmit = async (quizId: number) => {
    const quiz = quizzes?.find(q => q.id === quizId);
    if (!quiz) return;

    const responses = quiz.questions.map(question => ({
      question_id: question.id,
      answer: quizAnswers[question.id] || ''
    }));

    try {
      await submitQuizMutation.mutateAsync({
        quiz_id: quizId,
        responses
      });
      setActiveQuiz(null);
      setQuizAnswers({});
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Lesson not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lessons
        </Button>

        <Card className="border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{lesson.title}</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">By {lesson.instructor}</Badge>
              <Badge variant={lesson.status === 'PU' ? 'default' : 'secondary'}>
                {lesson.status === 'PU' ? 'Published' : 'Draft'}
              </Badge>
              {lesson.verified_at && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">
              <BookOpen className="mr-2 h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <Brain className="mr-2 h-4 w-4" />
              Quiz ({quizzes?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="practice">
              <Trophy className="mr-2 h-4 w-4" />
              Practice ({practiceTasks?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-4">
            {quizzes?.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Quiz #{quiz.version}</CardTitle>
                      <CardDescription>
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                        {quiz.ai_generated && (
                          <Badge variant="outline" className="ml-2">AI Generated</Badge>
                        )}
                      </CardDescription>
                    </div>
                    {activeQuiz !== quiz.id && (
                      <Button onClick={() => setActiveQuiz(quiz.id)}>
                        Start Quiz
                      </Button>
                    )}
                  </div>
                </CardHeader>

                {activeQuiz === quiz.id && (
                  <CardContent className="space-y-6">
                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <h4 className="font-medium">
                          {index + 1}. {question.question_text}
                        </h4>
                        <input
                          type="text"
                          className="w-full p-3 border rounded-md"
                          placeholder="Enter your answer..."
                          value={quizAnswers[question.id] || ''}
                          onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                        />
                      </div>
                    ))}
                    
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={() => handleQuizSubmit(quiz.id)}
                        disabled={submitQuizMutation.isPending}
                      >
                        {submitQuizMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveQuiz(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="practice" className="space-y-4">
            {practiceTasks?.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>Practice Task</CardTitle>
                  <Badge variant={
                    task.difficulty === 'EA' ? 'secondary' :
                    task.difficulty === 'ME' ? 'default' : 'destructive'
                  }>
                    {task.difficulty === 'EA' ? 'Easy' :
                     task.difficulty === 'ME' ? 'Medium' : 'Hard'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: task.content }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      
      <AIAssistant subject={subject?.name} lesson={lesson?.title} />
    </div>
  );
};