import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStudentProfile, useEnrollments } from "@/hooks/useApiQueries";
import { useAuth } from "@/providers/AuthProvider";
import { ArrowLeft, User, Mail, Calendar, Globe, GraduationCap, BookOpen, Trophy, Clock } from "lucide-react";

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage = ({ onBack }: ProfilePageProps) => {
  const { user, logout } = useAuth();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();

  const isLoading = profileLoading || enrollmentsLoading;

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.dp || undefined} alt={`${user?.first_name} ${user?.last_name}`} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {user?.first_name ? getInitials(`${user.first_name} ${user.last_name || ''}`) : 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold">{user?.first_name || user?.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Student'}</CardTitle>
                <CardDescription className="text-lg mt-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </CardDescription>
                
                <div className="flex items-center gap-4 mt-4">
                  {profile?.language && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {profile.language}
                    </Badge>
                  )}
                  {profile?.current_grade && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      Grade {profile.current_grade}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Member since registration
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-base">{user?.first_name || user?.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Not provided'}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{user?.email}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Language</p>
                <p className="text-base">{profile?.language || 'Not set'}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Current Grade</p>
                <p className="text-base">{profile?.current_grade || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Learning Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Enrolled Subjects</span>
                </div>
                <Badge variant="outline">{enrollments?.length || 0}</Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Account Created</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Recently
                </span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Profile Status</span>
                </div>
                <Badge variant={profile ? "default" : "secondary"}>
                  {profile ? "Complete" : "Incomplete"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Subjects */}
        {enrollments && enrollments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Enrolled Subjects ({enrollments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="p-3 border rounded-lg bg-background/50"
                  >
                    <h4 className="font-medium">{enrollment.subject}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enrolled Subject
                    </p>
                    <Badge 
                      variant="outline" 
                      className="mt-2 text-xs"
                    >
                      Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};