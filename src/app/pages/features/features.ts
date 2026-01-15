import { Component } from '@angular/core';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.html',
  styleUrls: ['./features.css'],
})
export class Features {
  features: Feature[] = [
    {
      title: 'Create Your Account',
      description:
        'Sign up in seconds with your email. Tell us about your profession, skills and career goals to get started on your personalized job search journey.',
      icon: 'user-plus',
    },
    {
      title: 'Set Your Preferences',
      description:
        'Specify your desired job roles, locations, salary expectations and visa requirements. Our AI learns your preferences to deliver the most relevant opportunities.',
      icon: 'settings',
    },
    {
      title: 'Get Matched Daily',
      description:
        'Our AI scans thousands of job listings every day and matches you with positions that fit your profile. Fresh opportunities delivered straight to your dashboard.',
      icon: 'sparkles',
    },
    {
      title: 'Apply with Ease',
      description:
        'Review your personalized job matches and apply directly through our platform. Track your applications and get notified of updates in real-time.',
      icon: 'send',
    },
  ];
}
