import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSubject, useLessons } from "@/hooks/useApiQueries";
import { useNavigate, useParams } from "react-router-dom";
import { AIAssistant } from "../learning/AIAssistant";


export const SubjectDetail = () => {
  const { subjectId } = useParams()
  const {data: subject} = useSubject(subjectId)
  const {data: lessons } = useLessons(subjectId)
  const navigate = useNavigate();

  console.log("Subject Detail", subjectId, subject, lessons);

  const onBack = () => {
    window.history.back();
  };

  const onSelectLesson = (lessonId:string) => {
    // Navigate to lesson detail page
    navigate(`/lessons/${lessonId}`);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Header */}
      <div className="bg-gradient-primary text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-white hover:bg-white/20 mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">{subject.name}</h1>
          <p className="text-blue-100 mb-4">{subject.description}</p>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/20 text-white border-white/30">
              {subject.grade_level}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              {subject.language}
            </Badge>
            <span className="text-blue-100">• 5 Lessons • 2.5 hours total</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Units Sidebar */}
          <div className="lg:col-span-1">

            {/* Progress Overview */}
            <Card className="shadow-soft mt-6">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    2 of 5 lessons completed
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lessons Content */}
          <div className="lg:col-span-3">
     
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id} 
                  className="shadow-soft hover:shadow-medium transition-all duration-200 cursor-pointer"
                  onClick={() => onSelectLesson(lesson.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            lesson.progress === 100 
                              ? 'bg-success text-success-foreground' 
                              : lesson.progress > 0
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {lesson.progress === 100 ? '✓' : index + 1}
                          </div>
                          <h3 className="text-lg font-semibold">{lesson.title}</h3>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 ml-11">{lesson.content}</p>
                        
                        <div className="flex items-center gap-4 mb-3 ml-11">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>⏱️</span>
                            <span>{lesson.duration}</span>
                          </div>
                       
                        </div>

                        {lesson.progress > 0 && (
                          <div className="ml-11">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{lesson.progress}%</span>
                            </div>
                            <Progress value={lesson.progress} className="w-full max-w-xs" />
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant={lesson.progress === 100 ? "secondary" : lesson.progress > 0 ? "outline" : "default"}
                        size="sm"
                      >
                        {lesson.progress === 100 ? 'Review' : lesson.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    <AIAssistant/>  
    </div>
  );
};