import { CommonModule , } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
 


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {

  constructor(private router: Router){}


  FAQS = [
    {
      question: 'What is an AI resume platform?',
      answer:
        'An AI resume platform uses artificial intelligence to help users create, optimize, and tailor their resumes to better match job descriptions and industry standards.',
    },
    {
      question: 'How does the AI help me with my resume?',
      answer:
        'The AI analyzes your input and suggests improvements based on keyword optimization, formatting, and best practices, ensuring your resume stands out to recruiters.',
        iconClass: 'text-green-500',
    },
    {
      question: 'Can I use the platform for free?',
      answer:
        'Yes, our platform offers a free basic version with essential features. For advanced tools and personalized feedback, consider upgrading to our premium plan.',
        iconClass: 'text-green-500',
    },
    {
      question: 'Is my data secure on the platform?',
      answer:
        'Absolutely. We prioritize your privacy and data security, using encryption and secure protocols to protect your information.',
        iconClass: 'text-green-500',
      },

    {
      question: 'What kind of jobs can I apply for with the optimized resume?',
      answer:
        'Our AI helps optimize resumes for a wide range of industries and job roles, increasing your chances of matching with relevant job openings.',
        iconClass: 'text-green-500',
      },

    {
      question: 'Can I customize the templates offered?',
      answer:
        'Yes, our platform offers a variety of customizable templates that you can adjust to fit your personal style and professional needs.',
        iconClass: 'text-green-500',
      },

    {
      question: 'How often should I update my resume?',
      answer:
        "It's a good practice to update your resume whenever you acquire new skills, complete new projects, or change jobs to ensure it reflects your most current qualifications.",
    },
  ];

  FEATURES = [
    {
      title: 'Powered by ChatGPT',
      description:
        'The cutting-edge language model that makes interactions a breeze. With its user-friendly interface, effortlessly tap into the world of AI-generated text.',
      image: 'https://www.svgrepo.com/show/530438/ddos-protection.svg',
    },
    {
      title: 'Easy to use',
      description:
        'Simply input your subject, click the generate button, and the result will appear in seconds just like magic.',
      image: 'https://www.svgrepo.com/show/530442/port-detection.svg',
    },
    {
      title: 'Custom settings',
      description:
        'We offer advanced customization. You can freely combine options like roles, languages, publish, tones, lengths, and formats.',
      image: 'https://www.svgrepo.com/show/530444/availability.svg',
    },
    {
      title: 'Free trial',
      description:
        'We offer a free trial service without login. We provide many payment options including pay-as-you-go and subscription.',
      image: 'https://www.svgrepo.com/show/530440/machine-vision.svg',
      link: '/pricing',
    },
    {
      title: '90+ templates',
      description:
        'We offer many templates covering areas such as writing, education, lifestyle, and creativity to inspire your potential.',
      image: 'https://www.svgrepo.com/show/530450/page-analysis.svg',
      link: '/templates',
    },
    {
      title: 'Use Anywhere',
      description:
        'Our product is compatible with multiple platforms including Web, Chrome, Windows, and Mac, so you can use MagickPen anywhere.',
      image: 'https://www.svgrepo.com/show/530453/mail-reception.svg',
      link: '/download',
    },
  ];

  EXTRA_FEATURES = [
    {
      title: 'Open-Source & Free Forever',
      description:'Contribute, customize, and use the tool with no costs involved, now or in the future.',
      iconClass: 'text-green-500',
    },
    {
      title: 'Privacy-Centric',
      description: 'Your data stays with you—no external storage or third-party access.',
      iconClass: 'text-green-500',
    },
    {
      title: 'Fully Customizable',
      description: 'Tailor your CV to any profession or industry with flexible design and format options.',
      iconClass: 'text-green-500',
    },

    {
      title: 'Customizable Templates & Input Validation',
      description:'Multiple resume templates to choose from.',
      iconClass: 'text-green-500',
    },
    {
      title: 'AI Features',
      description:'Auto Generate CVs with AI, ensuring your resume is unique and tailored to your skills and experiences.',
      iconClass: 'text-green-500',
    },
    {
      title: 'ATS-Optimized',
      description: 'Generate CVs that comply with Applicant Tracking Systems (ATS), ensuring your resume passes automated screening algorithms',
      iconClass: 'text-green-500',
    },
  ];



  login(){
    this.router.navigateByUrl('/auth/login');
  }
}
