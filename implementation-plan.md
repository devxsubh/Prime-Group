Product Requirements Document (PRD)
Prime Groups Matrimonial Web Application

Table of Contents
Executive Summary
Product Vision & Goals
User Personas
Functional Requirements
Non-Functional Requirements
User Flows & System Workflows
Data Model Overview
Payment Flow & Monetization Logic
Success Metrics & KPIs
Technical Architecture
Security & Compliance
Launch Strategy & Rollout Plan

1. Executive Summary
Prime Groups Matrimonial is a modern, high-performance matrimonial platform designed to connect individuals seeking life partners in a secure, privacy-focused environment. The platform implements a freemium monetization model where users can browse profiles freely but must subscribe to access contact details.
Core Value Proposition:
Fast, intuitive profile discovery with advanced filtering
Verified, quality profiles with privacy controls
Secure payment-gated contact exchange
Professional, trustworthy platform built for scale
Technology Stack:
Frontend: Next.js 14+ (App Router, React Server Components)
Backend: Supabase (PostgreSQL, Authentication, Storage, Realtime)
Payments: Razorpay/Stripe integration
Hosting: Vercel (Frontend) + Supabase Cloud
CDN: Cloudflare for static assets and image optimization

2. Product Vision & Goals
2.1 Vision Statement
To become the most trusted and efficient matrimonial platform by combining modern technology with traditional values, enabling meaningful connections through verified profiles and privacy-first design.
2.2 Strategic Goals
Year 1 Goals:
Achieve 10,000+ registered users
Maintain 95%+ uptime with <2s page load times
Reach 20% conversion rate (free to paid)
Establish trust through 100+ successful matches
Achieve 4.5+ star rating on trust platforms
Long-term Goals:
Scale to 100,000+ active users
Expand to multiple regions/languages
Build AI-powered compatibility matching
Develop mobile applications (iOS/Android)
2.3 Success Criteria
User Acquisition: 500+ new registrations per month
Engagement: 60% monthly active user rate
Conversion: 15-25% free-to-paid conversion
Retention: 70% user retention after 3 months
Revenue: ₹5L+ monthly recurring revenue by month 12

3. User Personas
3.1 Primary Personas
Persona 1: The Serious Seeker
Name: Priya Sharma
 Age: 28
 Occupation: Software Engineer
 Location: Bangalore, India
Background:
Working professional, ready for marriage
Family is involved in the process
Values privacy and verification
Tech-savvy, expects modern UX
Goals:
Find compatible matches based on values, education, profession
Maintain privacy until ready to connect
Avoid fake profiles and scammers
Pain Points:
Too many unverified profiles on other platforms
Privacy concerns with contact details visible to all
Poor user experience on existing platforms
Spam and irrelevant matches
User Journey:
Discovers platform through search/referral
Creates detailed profile
Browses matches with filters
Shortlists 5-10 profiles
Purchases subscription to unlock contacts
Initiates conversations with selected matches

Persona 2: The Parent/Guardian
Name: Rajesh Kumar
 Age: 55
 Occupation: Business Owner
 Location: Delhi, India
Background:
Looking for match for son/daughter
Less tech-savvy, needs simple interface
Values family background and traditions
Willing to pay for quality service
Goals:
Find suitable matches from good families
Easy profile creation and browsing
Clear communication with potential matches
Verified and trustworthy platform
Pain Points:
Complex registration processes
Difficulty navigating technology
Uncertainty about profile authenticity
Communication barriers

Persona 3: The NRI Professional
Name: Amit Patel
 Age: 32
 Occupation: Data Scientist
 Location: San Francisco, USA
Background:
Working abroad, seeking India-based or NRI match
Limited time for extensive searching
Higher willingness to pay for premium features
Values education and professional compatibility
Goals:
Find matches open to relocation or already abroad
Quick, efficient search with advanced filters
Video/virtual meeting capabilities
Professional, modern platform
Pain Points:
Time zone differences
Limited profile quality on other platforms
Need for quick, accurate filtering
Verification of claims (education, job)

3.2 Admin Personas
Admin Persona: Platform Manager
Name: Sneha Reddy
 Age: 30
 Occupation: Operations Manager
Responsibilities:
Profile verification and approval
User support and dispute resolution
Content moderation
Platform health monitoring
Goals:
Efficient workflow for profile verification
Quick response to user issues
Maintain platform quality
Track key metrics
Needs:
Comprehensive admin dashboard
Bulk action capabilities
Clear audit trails
Real-time alerts for issues

4. Functional Requirements
4.A USER-FACING APPLICATION
4.A.1 Landing & Marketing Pages
FR-LP-001: Homepage
Priority: P0 (Critical)
Description: SEO-optimized landing page with clear value proposition
Requirements:
Hero section with primary CTA ("Find Your Match")
Trust signals (user count, success stories, verification badge)
Feature highlights (privacy, verification, quality matches)
How it works section (3-4 step process)
Success stories/testimonials
Pricing preview
Footer with legal links (Privacy Policy, Terms of Service)
Performance Target: <1.5s LCP, 95+ Lighthouse score
SEO Requirements:
Meta tags optimized for "matrimonial", "marriage", "bride", "groom"
Structured data markup (Organization, WebSite)
Dynamic sitemap generation
FR-LP-002: About Us Page
Company background and mission
Team information (optional)
Trust and safety commitments
Contact information
FR-LP-003: Legal Pages
Privacy Policy (GDPR/data protection compliant)
Terms of Service
Refund Policy
Community Guidelines

4.A.2 Authentication & Onboarding
FR-AUTH-001: User Registration
Priority: P0
Requirements:
Email + Password registration
Phone number (optional, recommended)
Email verification mandatory before profile creation
Password strength requirements (min 8 chars, 1 uppercase, 1 number, 1 special)
Agree to Terms and Privacy Policy checkbox
CAPTCHA/reCAPTCHA for bot prevention
Technical: Supabase Auth with email confirmation
Validation:
Email format validation
Duplicate email prevention
Phone number format (if provided)
Error Handling:
Clear error messages for validation failures
Account already exists notification with login link
FR-AUTH-002: User Login
Priority: P0
Requirements:
Email + Password login
"Remember me" option (secure token storage)
"Forgot Password" flow with email reset link
Rate limiting (5 attempts per 15 minutes)
Session management (7-day default, 30-day with "remember me")
Technical: Supabase Auth with JWT tokens
Security:
Failed login attempt tracking
Account lockout after 5 failed attempts (30-minute cooldown)
FR-AUTH-003: Email Verification
Priority: P0
Requirements:
Automated email sent on registration
Verification link valid for 24 hours
Resend verification email option
Block profile creation until verified
Email Content:
Welcome message
Brand identity
Clear CTA button
Support contact
FR-AUTH-004: Password Reset
Priority: P0
Requirements:
Email-based password reset
Secure token (1-hour expiry)
Password reset confirmation email
Automatic logout from all devices after reset
FR-AUTH-005: Social Login (Future)
Priority: P2 (Future phase)
Google OAuth
Facebook OAuth

4.A.3 Profile Management
FR-PROFILE-001: Profile Creation Wizard
Priority: P0
Requirements:
Multi-step form (4-5 steps)
Progress indicator
Save draft functionality
Mandatory vs optional fields clearly marked
Profile photo upload (at least 1, max 6)
Profile creation cannot be skipped after email verification
Step 1: Basic Information
Full Name (mandatory)
Gender (mandatory)
Date of Birth (mandatory, must be 18+)
Marital Status (Never Married, Divorced, Widowed)
Height (dropdown, cm/feet)
Religion (dropdown)
Mother Tongue (dropdown)
Profile created for (Self/Son/Daughter/Sibling/Friend/Relative)
Step 2: Location & Contact
Country (mandatory)
State/City (mandatory)
Citizenship
Grew up in (city/country)
Residing in (city/country)
Phone number (optional but recommended)
Willing to relocate (Yes/No/Maybe)
Step 3: Education & Career
Highest Education (mandatory)
College/University
Field of Study
Employed In (Private/Government/Business/Not Working)
Occupation (mandatory if employed)
Organization
Annual Income (range slider, optional)
Step 4: Family Details
Father's Name (optional)
Father's Occupation
Mother's Name (optional)
Mother's Occupation
Number of Siblings
Family Type (Nuclear/Joint)
Family Values (Traditional/Moderate/Liberal)
Family Status (Middle Class/Upper Middle Class/Affluent)
Step 5: Partner Preferences
Age range (from - to)
Height range
Marital Status preference
Religion preference
Education preference
Location preference
Occupation preference
Annual income preference
Additional notes (free text, 500 chars)
FR-PROFILE-002: Photo Upload
Priority: P0
Requirements:
Min 1 photo, max 6 photos
Supported formats: JPEG, PNG, WebP
Max file size: 5MB per image
Automatic compression to WebP format
Thumbnail generation (150x150, 300x300, 600x600)
Face detection validation (optional, future)
Photo moderation queue (manual review)
Technical: Supabase Storage with public/private bucket strategy
Privacy: Photos visible only after profile approval
FR-PROFILE-003: Profile Editing
Priority: P0
Requirements:
Edit any field except: Date of Birth, Gender (requires admin approval)
Version history tracking (optional)
Changes require re-verification flag
Real-time save
Unsaved changes warning
FR-PROFILE-004: Profile Privacy Controls
Priority: P1
Requirements:
Hide profile from search (toggle)
Hide photos until connection accepted
Hide contact details (enforced until payment)
Block specific users
Deactivate profile temporarily
Delete profile permanently (with 30-day grace period)
FR-PROFILE-005: Profile Verification Badge
Priority: P1
Requirements:
Admin-approved verification badge
Display on profile card
Based on: Photo verification, ID proof, Employment proof
User can submit verification documents
Document upload section

4.A.4 Discovery & Matching
FR-SEARCH-001: Profile Browsing
Priority: P0
Requirements:
Paginated profile grid (12 profiles per page)
Card view showing: Photo, Name, Age, Location, Education, Occupation
Quick filter bar at top
Infinite scroll option (user preference)
Default sort: Recently Active
Performance: <500ms query time for 10,000+ profiles
FR-SEARCH-002: Advanced Search & Filters
Priority: P0
Requirements:
Filter panel (collapsible sidebar)
Multi-select filters:
Age range (slider)
Height range (slider)
Marital Status
Religion
Mother Tongue
Country/State/City
Education level
Occupation category
Annual income range
Profile created by
With photo only (toggle)
Verified profiles only (toggle)
Save search criteria
Clear all filters button
Filter count badge
URL state management (shareable search URLs)
FR-SEARCH-003: Sorting Options
Recently Active
Newest First
Relevance (algorithm-based, future)
Last Login
FR-SEARCH-004: Profile Detail View
Priority: P0
Requirements:
Full-page profile view
Photo gallery (swipeable)
All profile information sections
"Contact Details" section (locked for free users)
Action buttons:
Express Interest (free)
Shortlist (free)
Unlock Contact (paid)
Report/Block
Back to results button
Previous/Next profile navigation
FR-SEARCH-005: Profile Shortlisting
Priority: P1
Requirements:
Heart icon to shortlist
Shortlist page with all saved profiles
Remove from shortlist
Add notes to shortlisted profiles
No limit on shortlist count
FR-SEARCH-006: Express Interest
Priority: P1
Requirements:
Send interest to any profile (free feature)
Interest notification to recipient
Track sent interests (Pending/Accepted/Declined)
Receive interests from others
Accept/Decline interest buttons
Auto-expire after 30 days if no response
Limit: 10 interests per day (prevent spam)
FR-SEARCH-007: Search Performance Optimization
Priority: P0
Technical Requirements:
Database indexing on filterable columns
Query caching (Redis, future)
Server-side pagination
Lazy loading for images
Prefetch next page
Edge caching for static filters (countries, religions, etc.)

4.A.5 Payments & Monetization
FR-PAY-001: Pricing Plans
Priority: P0
Requirements:
Free Plan:
Create profile
Browse all profiles
Use filters
Shortlist profiles
Send/receive interests
Limited contact reveals (0)
Basic Plan (₹999/month):
All free features
Unlock 10 contact details
Priority support
Premium Plan (₹2,499/month):
All basic features
Unlock 30 contact details
Verified badge request
Profile highlighting
Advanced search analytics
Elite Plan (₹4,999/3 months):
All premium features
Unlimited contact unlocks
Dedicated relationship manager
Profile consultation
FR-PAY-002: Payment Gateway Integration
Priority: P0
Requirements:
Integration: Razorpay (India) + Stripe (International)
Payment methods: UPI, Cards, Net Banking, Wallets
Secure checkout page
PCI DSS compliant
3D Secure authentication
Payment success/failure handling
Email receipt on successful payment
Webhook handling for payment status
FR-PAY-003: Subscription Management
Priority: P0
Requirements:
View current plan
Upgrade/downgrade plan
Auto-renewal (opt-in/opt-out)
Renewal reminder (3 days before expiry)
Payment history
Download invoices
Cancel subscription
Refund processing (within 7 days, pro-rata)
FR-PAY-004: Contact Unlock Flow
Priority: P0
Requirements:
"Unlock Contact" button on profile
Modal showing: Plan comparison, current credits remaining
If no credits: Redirect to pricing page
If credits available:
Confirm unlock (deduct 1 credit)
Reveal: Phone number, Email, WhatsApp link (if provided)
Store unlock history
No re-unlock required (permanent access)
Track unlocks per user (analytics)
FR-PAY-005: Free Trial (Optional)
Priority: P2
Requirements:
7-day free trial on first Premium subscription
Credit card required (₹1 authorization)
Auto-convert to paid after trial
One-time per user (email + phone verification)

4.A.6 User Dashboard
FR-DASH-001: Dashboard Overview
Priority: P0
Requirements:
Welcome message with user name
Profile completion percentage
Calls-to-action:
Complete profile (if incomplete)
Upgrade plan (if free user)
Verify profile
Quick stats:
Profile views (last 30 days)
Interests received
Shortlisted by others
Recent activity feed
Plan details and expiry
FR-DASH-002: Navigation Menu
Priority: P0
Requirements:
My Profile
Search Matches
Shortlisted
Interests (Sent/Received)
Unlocked Contacts
My Plan & Billing
Settings
Help & Support
Logout
FR-DASH-003: Notifications
Priority: P1
Requirements:
In-app notification bell
Notification types:
New interest received
Interest accepted/declined
Profile viewed by others
Plan expiry reminder
New matches (algorithm-based, future)
Mark as read/unread
Email notifications (user preference)
Notification preferences page

4.A.7 Security & Privacy
FR-SEC-001: Data Privacy
Priority: P0
Requirements:
Contact details never visible without payment
Profile visibility controls
User consent for data processing
Right to download data (GDPR)
Right to delete account
Data retention policy (30 days post-deletion)
FR-SEC-002: Anti-Scraping Measures
Priority: P1
Requirements:
Rate limiting on profile views (100/hour per IP)
CAPTCHA on search after threshold
Watermark on photos (subtle)
Disable right-click on images
Block automated browsing patterns
IP-based blocking for suspicious activity
FR-SEC-003: User Safety
Priority: P0
Requirements:
Report profile functionality
Block user functionality
Report categories: Fake profile, Inappropriate content, Harassment, Scam/Fraud
Admin review queue for reports
Automatic suspension after 3 reports (pending review)
Safety tips page
FR-SEC-004: Data Encryption
Priority: P0
Technical Requirements:
HTTPS everywhere
Password hashing (bcrypt, Supabase default)
Sensitive data encryption at rest
Secure session management
XSS protection
CSRF protection
SQL injection prevention (Supabase RLS)

4.A.8 Responsive Design & Performance
FR-UX-001: Mobile Responsiveness
Priority: P0
Requirements:
Fully responsive on all devices (320px - 2560px)
Touch-friendly UI elements (min 44px tap targets)
Mobile-first design approach
Hamburger menu on mobile
Swipeable photo galleries
Bottom navigation on mobile
FR-UX-002: Performance Standards
Priority: P0
Requirements:
Lighthouse Score: 90+ (Performance, Accessibility, SEO)
LCP: <2.5s
FID: <100ms
CLS: <0.1
Time to Interactive: <3.5s
Image optimization (WebP, lazy loading, responsive images)
Code splitting and lazy loading
CDN for static assets
FR-UX-003: Accessibility
Priority: P1
Requirements:
WCAG 2.1 AA compliance
Keyboard navigation support
Screen reader compatibility
Alt text for all images
Sufficient color contrast (4.5:1)
Focus indicators
ARIA labels

4.B ADMIN PANEL
4.B.1 Admin Authentication
FR-ADMIN-001: Admin Login
Priority: P0
Requirements:
Separate login route (/admin)
Email + Password (Supabase Auth)
2FA mandatory (TOTP)
Role-based access control
Roles: Super Admin, Admin, Moderator, Support
Session timeout: 2 hours
IP whitelist (optional)
FR-ADMIN-002: Admin Role Permissions
Priority: P0
Super Admin:
Full system access
User management (all actions)
Admin management (create, edit, delete admins)
Payment management
System settings
Analytics (all)
Admin:
User management (approve, edit, suspend)
Content moderation
Support tickets
Analytics (view only)
Moderator:
Profile approval/rejection
Content moderation
Report handling
Support:
View user profiles
Support ticket management
No edit permissions

4.B.2 User Management
FR-ADMIN-101: User List View
Priority: P0
Requirements:
Paginated table (50 users per page)
Columns: ID, Name, Email, Phone, Status, Plan, Created Date, Actions
Search by: Name, Email, Phone, ID
Filter by: Status (Active, Pending, Suspended, Deleted), Plan, Gender, Verification Status
Sort by: Created Date, Last Login, Plan
Bulk actions: Export to CSV, Bulk approve, Bulk suspend
Performance: <1s load time for 100k+ users
FR-ADMIN-102: User Profile View
Priority: P0
Requirements:
Complete profile information (read-only view)
All uploaded photos
Account status and history
Login history (last 10 logins with IP)
Payment history
Interests sent/received
Reports filed against user
Admin notes section (internal)
Action buttons:
Approve Profile
Reject Profile (with reason)
Suspend User (with reason and duration)
Verify Profile
Edit Profile (limited fields)
Delete User (soft delete)
Send Email
View Activity Log
FR-ADMIN-103: Profile Approval Queue
Priority: P0
Requirements:
List of pending profiles
Quick view: Photo, basic details
Approve/Reject with single click
Rejection reasons dropdown:
Inappropriate photos
Incomplete information
Suspected fake profile
Violates guidelines
Other (free text)
Rejection email sent automatically
SLA: Approve within 24 hours
FR-ADMIN-104: User Suspension
Priority: P0
Requirements:
Suspend user temporarily or permanently
Suspension reason (mandatory)
Suspension duration (1 day, 7 days, 30 days, permanent)
Email notification to user
Suspend actions:
Hide profile from search
Block login
Disable contact unlocks
Unsuspend functionality
Audit log of suspensions
FR-ADMIN-105: Profile Verification
Priority: P1
Requirements:
Verification request queue
View uploaded documents:
ID proof
Education certificate
Employment proof
Approve/Reject verification
Add verified badge on approval
Verification expiry (annual re-verification)

4.B.3 Content Management
FR-ADMIN-201: Homepage Content Editor
Priority: P1
Requirements:
Edit hero section text
Edit feature highlights
Edit success stories
Upload/change banner images
WYSIWYG editor for text content
Preview before publish
Publish/unpublish toggle
Version history
FR-ADMIN-202: Success Stories Management
Priority: P2
Requirements:
Add/edit/delete success stories
Upload couple photo
Story text (500 words max)
User names (optional anonymization)
Featured toggle
Order management (drag and drop)
FR-ADMIN-203: Legal Pages Editor
Priority: P1
Requirements:
Edit Privacy Policy
Edit Terms of Service
Edit Refund Policy
Edit Community Guidelines
Version tracking
Last updated timestamp
Approval workflow (Super Admin only)
FR-ADMIN-204: Email Template Management
Priority: P2
Requirements:
Manage email templates:
Welcome email
Email verification
Password reset
Plan expiry reminder
Interest received
Payment receipt
Template variables support
Preview functionality
Test email sending

4.B.4 Platform Analytics
FR-ADMIN-301: Dashboard Overview
Priority: P0
Requirements:
Key metrics (today, last 7 days, last 30 days):
Total users
Active users (logged in last 7 days)
New registrations (daily trend)
Paid users
Revenue (daily, monthly)
Conversion rate
Pending profile approvals
Open support tickets
Charts:
User growth over time (line chart)
Revenue over time (line chart)
Plan distribution (pie chart)
Gender distribution (pie chart)
Date range selector
FR-ADMIN-302: User Analytics
Priority: P1
Requirements:
Total users
Active users (DAU, WAU, MAU)
User retention (cohort analysis)
User demographics:
Gender split
Age distribution
Location distribution (state/country)
Religion distribution
Education level distribution
User behavior:
Avg. profile views per user
Avg. interests sent per user
Avg. session duration
Search patterns (top filters)
FR-ADMIN-303: Revenue Analytics
Priority: P0
Requirements:
Total revenue (all time, monthly, yearly)
Revenue by plan
MRR (Monthly Recurring Revenue)
ARPU (Average Revenue Per User)
Churn rate
Payment success/failure rates
Refund statistics
Revenue forecast (next 3 months)
Top paying users
FR-ADMIN-304: Engagement Analytics
Priority: P1
Requirements:
Profile completion rates
Avg. interests sent/received
Avg. shortlists per user
Contact unlock patterns
Peak usage times (hourly, daily)
Feature usage (which features are most used)
Conversion funnel:
Registration → Profile creation → Search → Interest → Payment
FR-ADMIN-305: Export Reports
Priority: P1
Requirements:
Export user list (CSV, Excel)
Export revenue report
Export activity report
Date range selection
Custom field selection
Scheduled reports (weekly, monthly)

4.B.5 Payment & Subscription Management
FR-ADMIN-401: Payment List
Priority: P0
Requirements:
All transactions table
Columns: Transaction ID, User, Plan, Amount, Status, Payment Method, Date
Filter by: Status (Success, Failed, Refunded), Plan, Date range
Search by: Transaction ID, User email
Export to CSV
FR-ADMIN-402: Refund Management
Priority: P0
Requirements:
Refund request queue
Process refund
Partial/full refund
Refund reason (mandatory)
Email notification
Refund status tracking
Audit log
FR-ADMIN-403: Plan Management
Priority: P1
Requirements:
Create/edit/disable plans
Set plan features
Set pricing
Set duration
Plan visibility (show/hide from users)
Promotional pricing
Coupon code management
FR-ADMIN-404: Coupon Management
Priority: P2
Requirements:
Create coupon codes
Discount type (percentage, fixed amount)
Valid from/to dates
Usage limit (total, per user)
Applicable plans
Deactivate coupon
Coupon usage report

4.B.6 Support & Moderation
FR-ADMIN-501: Support Ticket System
Priority: P1
Requirements:
User-submitted tickets
Ticket categories: Technical, Billing, Profile, Harassment, Other
Ticket status: Open, In Progress, Resolved, Closed
Assign to admin
Internal notes
Response templates
Email notifications
SLA tracking
FR-ADMIN-502: Report Management
Priority: P0
Requirements:
View reported profiles
Report details: Reported by, Reason, Description, Date
Review reported profile
Action options:
Dismiss report
Warn user
Suspend user
Delete profile
Multi-report tracking (same profile reported multiple times)
Auto-flag profiles with 3+ reports
Email notification to reporter on resolution
FR-ADMIN-503: Content Moderation Queue
Priority: P0
Requirements:
Photo moderation (pending photos)
Profile text moderation (AI-flagged content)
Approve/reject photos
Edit inappropriate text
Moderation guidelines reference
Bulk approve

4.B.7 System Settings & Configuration
FR-ADMIN-601: System Configuration
Priority: P1
Requirements:
Site settings:
Site name, logo, favicon
Contact email, phone
Social media links
Feature toggles:
Enable/disable registrations
Enable/disable search
Maintenance mode
Email settings:
SMTP configuration
From email address
Payment settings:
Payment gateway credentials
Tax configuration
FR-ADMIN-602: Audit Logs
Priority: P1
Requirements:
All admin actions logged:
User: Admin who performed action
Action: Type of action
Target: User/entity affected
Timestamp
IP address
Log retention: 12 months
Search and filter logs
Export logs
Immutable log storage
FR-ADMIN-603: Admin User Management
Priority: P0 (Super Admin only)
Requirements:
Create admin users
Assign roles
Edit admin details
Deactivate admin
View admin activity
Password reset for admins

5. Non-Functional Requirements
5.1 Performance
NFR-PERF-001: Page Load Performance
Initial page load: <2 seconds (p95)
Subsequent navigation: <500ms
API response time: <200ms (p95)
Database query time: <100ms (p95)
Image load time: <1 second (lazy loading)
NFR-PERF-002: Scalability
Support 10,000 concurrent users
Handle 100 requests/second
Database: Optimize for 1M+ user profiles
Horizontal scaling capability
Auto-scaling based on load
NFR-PERF-003: Caching Strategy
Static content: CDN caching (1 year)
Dynamic content: Server-side caching (5 minutes)
User session: In-memory cache
Database queries: Query result caching (1 minute)
Image caching: Aggressive CDN caching
NFR-PERF-004: Optimization Techniques
Next.js App Router with React Server Components
Server-Side Rendering (SSR) for SEO pages
Incremental Static Regeneration (ISR) for profile pages
Client-side prefetching
Code splitting and lazy loading
Image optimization (WebP, responsive sizes)
Database connection pooling
Indexed database queries

5.2 Security
NFR-SEC-001: Authentication & Authorization
Supabase Auth with JWT tokens
Row Level Security (RLS) on all tables
Role-based access control (RBAC)
Session management (secure, httpOnly cookies)
Password hashing (bcrypt via Supabase)
2FA for admin accounts
Rate limiting on auth endpoints
NFR-SEC-002: Data Protection
HTTPS/TLS 1.3 for all traffic
Data encryption at rest (Supabase default)
PII (Personally Identifiable Information) encryption
Payment data: PCI DSS compliant (via Razorpay/Stripe)
Regular security audits
SQL injection prevention (parameterized queries)
XSS protection (React default + CSP headers)
CSRF protection
NFR-SEC-003: Privacy
GDPR compliance
Data minimization principle
User consent management
Data retention policy (30 days post-deletion)
Right to access data
Right to delete data
Privacy by design
NFR-SEC-004: Monitoring & Incident Response
Security monitoring (failed login attempts, unusual activity)
Automated alerts for security events
Incident response plan
Regular penetration testing
Vulnerability scanning
Dependency security audits (npm audit)

5.3 Reliability & Availability
NFR-REL-001: Uptime
Target: 99.9% uptime (SLA)
Planned maintenance: <2 hours/month
Zero-downtime deployments
Multi-region failover (future)
NFR-REL-002: Backup & Disaster Recovery
Daily automated backups (Supabase)
Point-in-time recovery (7 days)
Backup retention: 30 days
Disaster recovery plan
RTO (Recovery Time Objective): <4 hours
RPO (Recovery Point Objective): <1 hour
NFR-REL-003: Error Handling
Graceful degradation
User-friendly error messages
Error logging (Sentry/LogRocket)
Automatic error reporting
Error recovery mechanisms

5.4 Scalability
NFR-SCALE-001: User Growth
Support 100K users in Year 1
Plan for 1M users by Year 3
Database partitioning strategy (future)
Read replicas for reporting (future)
Sharding strategy (if needed)
NFR-SCALE-002: Geographic Expansion
Multi-region deployment ready
CDN for global content delivery
Localization support (i18n framework)
Currency conversion support

5.5 Maintainability
NFR-MAINT-001: Code Quality
TypeScript for type safety
ESLint + Prettier for code formatting
Code review process
Unit test coverage: >70%
Integration tests for critical paths
E2E tests (Playwright/Cypress)
NFR-MAINT-002: Documentation
Technical documentation (architecture, APIs)
User documentation (help center)
Admin documentation (operational guides)
API documentation (if exposing APIs)
Code comments for complex logic
NFR-MAINT-003: DevOps
CI/CD pipeline (GitHub Actions)
Automated testing in pipeline
Staging environment
Feature flags for gradual rollouts
Monitoring and alerting (Vercel Analytics, Supabase Metrics)
Log aggregation

5.6 Usability
NFR-USE-001: User Experience
Intuitive navigation (max 3 clicks to any feature)
Consistent UI/UX across platform
Mobile-first design
Accessibility (WCAG 2.1 AA)
Clear error messages and guidance
Onboarding tooltips for first-time users
NFR-USE-002: Performance Perception
Loading states for async operations
Optimistic UI updates
Skeleton screens
Progress indicators
No blocking operations

5.7 Compliance
NFR-COMP-001: Legal Compliance
GDPR (General Data Protection Regulation)
CCPA (California Consumer Privacy Act)
IT Act 2000 (India)
PCI DSS (Payment Card Industry Data Security Standard)
Terms of Service
Privacy Policy
Cookie Policy
Refund Policy
NFR-COMP-002: Ethical Standards
No discrimination in matching
Transparent pricing
Clear feature limitations
Honest marketing
User safety first
Data ethics

6. User Flows & System Workflows
6.1 User Registration & Onboarding Flow
1. User lands on homepage
   ↓
2. Clicks "Sign Up" / "Register"
   ↓
3. Registration form
   - Email
   - Password
   - Agree to Terms
   - CAPTCHA
   ↓
4. Submit → Supabase Auth creates account
   ↓
5. Email verification sent
   ↓
6. User clicks verification link
   ↓
7. Email verified → Redirect to login
   ↓
8. User logs in
   ↓
9. Profile creation wizard (mandatory)
   - Step 1: Basic info
   - Step 2: Location
   - Step 3: Education & Career
   - Step 4: Family
   - Step 5: Photos & Preferences
   ↓
10. Profile submitted for approval
    ↓
11. Admin reviews profile (within 24h)
    ↓
12. Profile approved → User can search
    OR
    Profile rejected → Email with reason → User edits → Resubmit

Edge Cases:
Email already exists → Show error + login link
Verification email not received → Resend option
User exits wizard → Draft saved, resume later
Profile incomplete → Block search access, show completion prompt

6.2 Profile Search & Discovery Flow
1. User logs in → Dashboard
   ↓
2. Clicks "Search Matches"
   ↓
3. Profile grid loads (default: all active profiles)
   ↓
4. User applies filters (age, location, education, etc.)
   ↓
5. Filtered results displayed (paginated)
   ↓
6. User clicks on profile card
   ↓
7. Profile detail page opens
   - Full profile info
   - Photos
   - Locked contact section (if not unlocked)
   ↓
8. User actions:
   a. Express Interest → Interest sent, notification to recipient
   b. Shortlist → Added to shortlist
   c. Unlock Contact → Check plan
      - If credits available → Deduct credit → Show contact
      - If no credits → Redirect to pricing page
   d. Report/Block → Report submitted
   ↓
9. Back to search → Continue browsing

Edge Cases:
No profiles match filters → "No results" message + suggestion to broaden
Profile already unlocked → Show contact details directly
User blocks profile → Profile hidden from all future searches
Interest already sent → Show "Interest sent" status

6.3 Interest Exchange Flow
Sender Side:
1. User views profile
   ↓
2. Clicks "Express Interest"
   ↓
3. Interest record created (status: Pending)
   ↓
4. Notification sent to recipient
   ↓
5. Interest appears in sender's "Sent Interests" (status: Pending)

Recipient Side:
1. Receives notification (email + in-app)
   ↓
2. Clicks notification → Views sender's profile
   ↓
3. Decides: Accept or Decline
   ↓
4. If Accept:
   - Interest status → Accepted
   - Both users notified
   - Contact details unlocked (if paid user) OR prompt to unlock
   ↓
5. If Decline:
   - Interest status → Declined
   - Sender notified
   - No further action
   ↓
6. If no response in 30 days:
   - Interest auto-expires
   - Status → Expired

Edge Cases:
Daily limit reached (10 interests/day) → Block sending, show upgrade prompt
Recipient profile deleted → Interest auto-declined
Both users shortlisted each other → Mutual interest notification

6.4 Payment & Contact Unlock Flow
Free User Path:
1. User clicks "Unlock Contact" on profile
   ↓
2. System checks: Current plan credits
   ↓
3. If no credits:
   a. Modal: "Upgrade to unlock contacts"
   b. Plan comparison shown
   c. User clicks "Upgrade"
   ↓
4. Redirect to pricing page
   ↓
5. User selects plan
   ↓
6. Checkout page (Razorpay/Stripe)
   - User details pre-filled
   - Payment method selection
   - Total amount shown
   ↓
7. User completes payment
   ↓
8. Payment gateway callback → Webhook received
   ↓
9. Supabase: Update user subscription
   - Plan activated
   - Credits added
   - Payment record created
   ↓
10. Redirect to success page
    ↓
11. Email receipt sent
    ↓
12. User can now unlock contacts

Paid User Path:
1. User clicks "Unlock Contact"
   ↓
2. System checks credits: Available
   ↓
3. Confirm unlock modal
   ↓
4. User confirms
   ↓
5. Deduct 1 credit
   ↓
6. Create unlock record
   ↓
7. Reveal contact details:
   - Phone number
   - Email
   - WhatsApp link (if provided)
   ↓
8. Add to "Unlocked Contacts" list
   ↓
9. No re-unlock needed (permanent access)

Edge Cases:
Payment fails → Show error, retry option, support contact
Payment pending → Show "Processing" status, webhook updates later
User already unlocked this profile → Show contact directly (no charge)
Credits insufficient → Prompt to upgrade or buy credits
Plan expires mid-session → Block unlocks, show renewal prompt

6.5 Admin Profile Approval Flow
1. User submits profile after creation
   ↓
2. Profile status → Pending
   ↓
3. Admin logs into admin panel
   ↓
4. Navigates to "Pending Approvals"
   ↓
5. List of pending profiles displayed
   ↓
6. Admin clicks on profile to review
   ↓
7. Full profile view + photos
   ↓
8. Admin decision:
   a. Approve:
      - Click "Approve"
      - Profile status → Active
      - Email sent to user: "Profile approved"
      - Profile visible in search
   ↓
   b. Reject:
      - Click "Reject"
      - Select reason from dropdown
      - Add custom note (optional)
      - Profile status → Rejected
      - Email sent to user with reason
      - User can edit and resubmit
   ↓
9. Next profile in queue

Edge Cases:
User deletes account while pending → Auto-remove from queue
Admin session expires → Auto-save notes, re-login required
Bulk approval → Select multiple, approve all at once
Unclear case → Flag for senior admin review

6.6 Report Handling Flow
User Side:
1. User views profile
   ↓
2. Clicks "Report" button
   ↓
3. Report form modal:
   - Reason (dropdown): Fake, Inappropriate, Harassment, Scam
   - Description (optional text)
   ↓
4. Submit report
   ↓
5. Report record created
   ↓
6. Confirmation message: "Report submitted"

Admin Side:
1. Report appears in "Reports" queue
   ↓
2. If same profile reported 3+ times:
   - Auto-flag for priority review
   - Optional: Auto-suspend profile (pending review)
   ↓
3. Admin reviews report
   - View reported profile
   - View report details
   - View all reports against this user
   ↓
4. Admin action:
   a. Dismiss (false alarm)
      - Mark report as dismissed
      - No action on user
   ↓
   b. Warn user
      - Send warning email
      - Log warning
      - Profile remains active
   ↓
   c. Suspend user
      - Select duration (1 day, 7 days, 30 days, permanent)
      - Add suspension reason
      - Profile hidden from search
      - User login blocked
      - Email notification sent
   ↓
   d. Delete profile
      - Soft delete user account
      - All data retained (30 days)
      - Email notification sent
   ↓
5. Report marked as resolved
   ↓
6. Email sent to reporter (optional)

Edge Cases:
User reports own profile → Block action, show error
Reported user deletes account → Auto-close reports
Multiple reports from same user → Flag as potential abuse
Urgent reports (harassment, safety) → Priority queue, immediate review

7. Data Model Overview
7.1 Database Schema (Supabase PostgreSQL)
Design Principles:
Normalized schema (3NF)
Row Level Security (RLS) on all tables
Soft deletes (deleted_at timestamp)
Created/updated timestamps on all tables
UUID primary keys
Foreign key constraints with cascading

7.2 Core Tables
7.2.1 Users Table (users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255), -- Managed by Supabase Auth
  role VARCHAR(20) DEFAULT 'user', -- user, admin, super_admin
  status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  last_login_at TIMESTAMP,
  last_login_ip INET
);

-- RLS Policy: Users can only read/update their own record
-- Admins can read all, update status


7.2.2 Profiles Table (profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Info
  full_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL, -- male, female, other
  date_of_birth DATE NOT NULL,
  age INT GENERATED ALWAYS AS (EXTRACT(YEAR FROM AGE(date_of_birth))) STORED,
  marital_status VARCHAR(20), -- never_married, divorced, widowed
  height_cm INT,
  religion VARCHAR(50),
  mother_tongue VARCHAR(50),
  profile_for VARCHAR(20), -- self, son, daughter, sibling, friend, relative
  
  -- Location
  country VARCHAR(50),
  state VARCHAR(50),
  city VARCHAR(50),
  citizenship VARCHAR(50),
  grew_up_in VARCHAR(100),
  residing_in VARCHAR(100),
  willing_to_relocate VARCHAR(10), -- yes, no, maybe
  
  -- Education & Career
  highest_education VARCHAR(100),
  college_university VARCHAR(150),
  field_of_study VARCHAR(100),
  employed_in VARCHAR(50), -- private, government, business, not_working
  occupation VARCHAR(100),
  organization VARCHAR(150),
  annual_income_min INT,
  annual_income_max INT,
  
  -- Family
  father_name VARCHAR(100),
  father_occupation VARCHAR(100),
  mother_name VARCHAR(100),
  mother_occupation VARCHAR(100),
  siblings_count INT,
  family_type VARCHAR(20), -- nuclear, joint
  family_values VARCHAR(20), -- traditional, moderate, liberal
  family_status VARCHAR(30), -- middle_class, upper_middle_class, affluent
  
  -- Profile Status
  profile_status VARCHAR(20) DEFAULT 'pending', -- pending, active, rejected, suspended
  verification_status VARCHAR(20) DEFAULT 'unverified', -- unverified, verified
  profile_completion_pct INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  rejection_reason TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  deleted_at TIMESTAMP,
  
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_profiles_status ON profiles(profile_status);
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_profiles_age ON profiles(age);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_religion ON profiles(religion);

-- RLS: Users can read active profiles, update only their own


7.2.3 Profile Photos Table (profile_photos)
CREATE TABLE profile_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  uploaded_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_photos_profile ON profile_photos(profile_id);
CREATE INDEX idx_photos_status ON profile_photos(status);


7.2.4 Partner Preferences Table (partner_preferences)
CREATE TABLE partner_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  age_min INT,
  age_max INT,
  height_min_cm INT,
  height_max_cm INT,
  marital_status VARCHAR(100), -- JSON array or comma-separated
  religion VARCHAR(100),
  education VARCHAR(200),
  location VARCHAR(200),
  occupation VARCHAR(200),
  income_min INT,
  income_max INT,
  additional_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(profile_id)
);


7.2.5 Interests Table (interests)
CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_profile_id UUID REFERENCES profiles(id),
  receiver_profile_id UUID REFERENCES profiles(id),
  
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, expired
  message TEXT,
  
  sent_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days',
  
  UNIQUE(sender_id, receiver_id)
);

CREATE INDEX idx_interests_receiver ON interests(receiver_id, status);
CREATE INDEX idx_interests_sender ON interests(sender_id, status);


7.2.6 Shortlists Table (shortlists)
CREATE TABLE shortlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, profile_id)
);

CREATE INDEX idx_shortlists_user ON shortlists(user_id);


7.2.7 Subscriptions Table (subscriptions)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  
  status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
  credits_remaining INT DEFAULT 0,
  
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  auto_renew BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);


7.2.8 Plans Table (plans)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL, -- Basic, Premium, Elite
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  
  price_inr INT NOT NULL,
  price_usd INT,
  
  duration_days INT, -- 30, 90, 365, NULL for lifetime
  credits INT, -- Contact unlock credits
  
  features JSONB, -- Array of features
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


7.2.9 Payments Table (payments)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  plan_id UUID REFERENCES plans(id),
  
  amount INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  
  payment_gateway VARCHAR(20), -- razorpay, stripe
  gateway_transaction_id VARCHAR(255) UNIQUE,
  gateway_order_id VARCHAR(255),
  
  status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed, refunded
  payment_method VARCHAR(50), -- upi, card, netbanking, wallet
  
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  refund_amount INT,
  refund_reason TEXT,
  
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway_txn ON payments(gateway_transaction_id);


7.2.10 Contact Unlocks Table (contact_unlocks)
CREATE TABLE contact_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unlocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  unlocked_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unlocked_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  credits_used INT DEFAULT 1,
  
  unlocked_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(unlocker_id, unlocked_profile_id)
);

CREATE INDEX idx_unlocks_unlocker ON contact_unlocks(unlocker_id);


7.2.11 Reports Table (reports)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  reason VARCHAR(50) NOT NULL, -- fake, inappropriate, harassment, scam
  description TEXT,
  
  status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, dismissed, resolved
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reported_user ON reports(reported_user_id);


7.2.12 Admin Actions Log Table (admin_actions)
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id),
  action_type VARCHAR(50) NOT NULL, -- approve_profile, reject_profile, suspend_user, etc.
  target_user_id UUID REFERENCES users(id),
  target_profile_id UUID REFERENCES profiles(id),
  
  details JSONB,
  ip_address INET,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_type ON admin_actions(action_type);


7.2.13 Notifications Table (notifications)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- interest_received, interest_accepted, profile_viewed, plan_expiry
  title VARCHAR(200),
  message TEXT,
  
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);


7.3 Row Level Security (RLS) Policies
General Principles:
Users can only read active, approved profiles
Users can only update their own profile
Admins have elevated permissions
Contact details are masked unless unlocked
All queries are filtered by RLS automatically
Example RLS Policies:
-- Users can read only active profiles
CREATE POLICY "Users can view active profiles"
  ON profiles FOR SELECT
  USING (profile_status = 'active' AND is_visible = TRUE);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'super_admin')
  );


8. Payment Flow & Monetization Logic
8.1 Pricing Strategy
Free Tier:
Profile creation and management
Unlimited browsing
Advanced filters
Shortlisting
Send/receive interests (max 10/day)
Restriction: Cannot view contact details
Paid Tiers:
Plan
Price (INR)
Duration
Credits
Features
Basic
₹999
1 month
10
10 contact unlocks, Priority support
Premium
₹2,499
1 month
30
30 contact unlocks, Verified badge, Profile boost
Elite
₹4,999
3 months
Unlimited
Unlimited unlocks, Relationship manager, Premium support

Add-ons (Future):
Extra credits: ₹149 for 3 credits
Profile boost: ₹299 for 7 days
Featured profile: ₹499 for 30 days

8.2 Payment Integration
Payment Gateways:
Primary (India): Razorpay
Secondary (International): Stripe
Payment Flow:
1. User selects plan on pricing page
   ↓
2. Frontend: Create order API call
   - Endpoint: POST /api/payments/create-order
   - Body: { plan_id, user_id }
   ↓
3. Backend: Create order with payment gateway
   - Razorpay: orders.create()
   - Generate order_id
   - Store in database (payments table, status: pending)
   ↓
4. Return order_id to frontend
   ↓
5. Frontend: Open Razorpay checkout modal
   - Pre-fill user details
   - Display amount, plan details
   ↓
6. User completes payment
   ↓
7. Razorpay callback to frontend
   - Success: payment_id, order_id, signature
   - Failure: error details
   ↓
8. Frontend: Verify payment API call
   - Endpoint: POST /api/payments/verify
   - Body: { payment_id, order_id, signature }
   ↓
9. Backend: Verify signature
   - Razorpay: crypto.verify(signature, order_id + payment_id, secret)
   ↓
10. If valid:
    - Update payment status: success
    - Create/update subscription
    - Add credits to user account
    - Send email receipt
    - Return success response
    ↓
11. Frontend: Redirect to success page
    - Show: Plan activated, credits added, next steps
    
If payment fails:
- Update payment status: failed
- Log error details
- Redirect to failure page
- Show retry option


8.3 Webhook Handling
Razorpay Webhooks:
payment.captured (success)
payment.failed
subscription.charged (recurring payments, future)
refund.processed
Webhook Endpoint: POST /api/webhooks/razorpay
Verification:
const crypto = require('crypto');

const verifyWebhook = (webhookBody, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(webhookBody))
    .digest('hex');
  
  return expectedSignature === signature;
};

Idempotency:
Store webhook event IDs to prevent duplicate processing
Table: webhook_events (id, event_id, event_type, processed_at)

8.4 Credit Management
Credit Deduction Logic:
async function unlockContact(unlockerId, profileId) {
  // 1. Check if already unlocked
  const existingUnlock = await supabase
    .from('contact_unlocks')
    .select('id')
    .eq('unlocker_id', unlockerId)
    .eq('unlocked_profile_id', profileId)
    .single();
  
  if (existingUnlock) {
    return { success: true, alreadyUnlocked: true };
  }
  
  // 2. Check active subscription and credits
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', unlockerId)
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .single();
  
  if (!subscription) {
    return { success: false, error: 'No active subscription' };
  }
  
  if (subscription.credits_remaining <= 0 && subscription.plan_type !== 'elite') {
    return { success: false, error: 'Insufficient credits' };
  }
  
  // 3. Deduct credit (transaction)
  const { data, error } = await supabase.rpc('unlock_contact', {
    p_unlocker_id: unlockerId,
    p_profile_id: profileId,
    p_subscription_id: subscription.id
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

Database Function (PostgreSQL):
CREATE OR REPLACE FUNCTION unlock_contact(
  p_unlocker_id UUID,
  p_profile_id UUID,
  p_subscription_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Deduct credit (skip for unlimited plans)
  UPDATE subscriptions
  SET credits_remaining = credits_remaining - 1
  WHERE id = p_subscription_id
    AND (credits_remaining > 0 OR plan_type = 'elite');
  
  -- Create unlock record
  INSERT INTO contact_unlocks (unlocker_id, unlocked_profile_id, unlocked_user_id)
  SELECT p_unlocker_id, p_profile_id, user_id
  FROM profiles
  WHERE id = p_profile_id;
  
END;
$$ LANGUAGE plpgsql;


8.5 Refund Policy
Refund Eligibility:
Within 7 days of purchase
No credits used (or pro-rata refund)
Valid reason (unsatisfactory service, technical issues, accidental purchase)
Refund Process:
1. User requests refund (support ticket or self-service)
   ↓
2. Admin reviews request
   - Check: Purchase date, credits used, reason
   ↓
3. If approved:
   - Calculate refund amount (full or pro-rata)
   - Initiate refund via Razorpay
   - Update subscription status: cancelled
   - Revoke credits
   - Update payment record: status = refunded
   - Email confirmation
   ↓
4. Refund processed (3-7 business days)


9. Success Metrics & KPIs
9.1 Acquisition Metrics
Metric
Target (Month 3)
Target (Month 12)
Total Registrations
2,000
10,000
New Registrations/Month
500
1,500
Registration Conversion Rate (Landing → Signup)
3%
5%
Email Verification Rate
80%
85%
Profile Completion Rate
70%
80%

Measurement:
Google Analytics events
Supabase database queries
Conversion funnel tracking

9.2 Engagement Metrics
Metric
Target
Daily Active Users (DAU)
15% of total users
Monthly Active Users (MAU)
60% of total users
Avg. Session Duration
8-12 minutes
Avg. Profiles Viewed per Session
15-20
Avg. Interests Sent per Active User
2-3 per week
Shortlist Rate
30% of profiles viewed
Return Visitor Rate (within 7 days)
50%

Measurement:
Analytics tracking (Vercel Analytics, Google Analytics)
Database queries on user activity

9.3 Conversion Metrics
Metric
Target (Month 3)
Target (Month 12)
Free-to-Paid Conversion Rate
10%
20%
Paid Users
200
2,000
Average Revenue Per User (ARPU)
₹1,200
₹1,500
Monthly Recurring Revenue (MRR)
₹2,40,000
₹30,00,000
Churn Rate
<10%
<5%
Customer Lifetime Value (LTV)
₹3,600
₹6,000

Measurement:
Payments table analysis
Subscription status tracking
Cohort analysis

9.4 Quality Metrics
Metric
Target
Profile Approval Rate (First Submission)
>85%
Avg. Approval Time
<12 hours
Verified Profiles
>30% of active profiles
Report Rate (Reports per 1000 users)
<5
Fake Profile Detection Rate
>95%
User Satisfaction Score (CSAT)
>4.2/5

Measurement:
Admin dashboard analytics
User surveys (post-match, post-payment)
Reports table analysis

9.5 Technical Performance Metrics
Metric
Target
Page Load Time (LCP)
<2s
API Response Time (p95)
<200ms
Uptime
>99.9%
Error Rate
<0.1%
Lighthouse Score
>90
Mobile Performance Score
>85

Measurement:
Vercel Analytics
Supabase Performance Monitoring
Lighthouse CI
Sentry (error tracking)

9.6 Business Metrics
Metric
Target (Year 1)
Total Revenue
₹50,00,000
Cost Per Acquisition (CPA)
<₹500
Customer Acquisition Cost (CAC)
<₹1,000
LTV:CAC Ratio
>3:1
Success Stories (Matched Couples)
>100
Net Promoter Score (NPS)
>40

Measurement:
Financial tracking
Marketing attribution
User surveys
Success story submissions

10. Technical Architecture
10.1 System Architecture
┌─────────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Next.js 14 App Router                    │   │
│  │  - React Server Components                       │   │
│  │  - Client Components                             │   │
│  │  - Server Actions                                │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/TLS
                     ▼
┌─────────────────────────────────────────────────────────┐
│               VERCEL EDGE NETWORK                        │
│  - CDN                                                   │
│  - Edge Functions                                        │
│  - Automatic Scaling                                     │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  Next.js API     │    │   Supabase       │
│  Routes          │◄───┤   - PostgreSQL   │
│  - /api/*        │    │   - Auth (JWT)   │
│  - Server Actions│    │   - Storage      │
│                  │    │   - Realtime     │
│                  │    │   - RLS          │
└─────────┬────────┘    └──────────────────┘
          │
          ▼
┌──────────────────────┐
│  Payment Gateways    │
│  - Razorpay (India)  │
│  - Stripe (Intl)     │
└──────────────────────┘


10.2 Technology Stack Details
Frontend:
Framework: Next.js 14+ (App Router)
Language: TypeScript
UI Library: React 18+
Styling: Tailwind CSS
Components: shadcn/ui (or custom)
State Management: React Context + Server State (no Redux needed)
Forms: React Hook Form + Zod validation
HTTP Client: Fetch API + Supabase JS Client
Backend:
Database: Supabase PostgreSQL
Authentication: Supabase Auth (JWT-based)
Storage: Supabase Storage (S3-compatible)
API: Next.js API Routes + Server Actions
Realtime: Supabase Realtime (optional, for notifications)
Payments:
Gateway: Razorpay (India), Stripe (International)
Integration: Razorpay Checkout, Stripe Checkout
Infrastructure:
Hosting: Vercel (Frontend + API)
Database Hosting: Supabase Cloud
CDN: Cloudflare (images), Vercel Edge Network
Domain & DNS: Cloudflare
DevOps:
Version Control: Git + GitHub
CI/CD: GitHub Actions + Vercel Auto-Deploy
Monitoring: Vercel Analytics, Supabase Dashboard
Error Tracking: Sentry
Logging: Vercel Logs, Supabase Logs
Third-Party Services:
Email: SendGrid / Resend
SMS (OTP): Twilio / MSG91
Analytics: Google Analytics 4, Vercel Analytics
SEO: Next.js built-in (meta tags, sitemap, robots.txt)

10.3 Deployment Strategy
Environments:
Development: Local (localhost:3000)
Staging: Vercel preview deployments (feature branches)
Production: Vercel production (main branch)
Database Environments:
Development: Local Supabase (Docker)
Staging: Supabase staging project
Production: Supabase production project
Deployment Flow:
1. Developer creates feature branch
   ↓
2. Commits code + pushes to GitHub
   ↓
3. Vercel auto-deploys preview (staging)
   ↓
4. QA/Testing on preview URL
   ↓
5. Code review + PR approval
   ↓
6. Merge to main branch
   ↓
7. Vercel auto-deploys to production
   ↓
8. Health checks + smoke tests
   ↓
9. Monitor metrics (Vercel, Sentry)


10.4 API Design
RESTful API Structure:
/api/
  /auth/
    - POST /register
    - POST /login
    - POST /logout
    - POST /reset-password
    - POST /verify-email
  
  /profiles/
    - GET /profiles (list, search, filter)
    - POST /profiles (create)
    - GET /profiles/:id (view)
    - PATCH /profiles/:id (update)
    - DELETE /profiles/:id (soft delete)
  
  /interests/
    - GET /interests (sent, received)
    - POST /interests (send)
    - PATCH /interests/:id (accept/decline)
  
  /payments/
    - POST /create-order
    - POST /verify
    - GET /history
    - POST /refund
  
  /admin/
    - GET /users
    - PATCH /users/:id (approve, suspend)
    - GET /reports
    - PATCH /reports/:id (resolve)
    - GET /analytics
  
  /webhooks/
    - POST /razorpay
    - POST /stripe

Server Actions (Next.js):
Preferred for mutations (create, update, delete)
Automatic CSRF protection
Direct database access via Supabase client

11. Security & Compliance
11.1 Authentication Security
Password Requirements: Min 8 chars, 1 uppercase, 1 number, 1 special
Password Hashing: bcrypt (via Supabase Auth)
Session Management: JWT tokens (httpOnly cookies)
Token Expiry: 7 days (default), refresh token rotation
Rate Limiting: 5 login attempts per 15 minutes
Account Lockout: 30 minutes after 5 failed attempts
2FA: Mandatory for admin accounts (TOTP)

11.2 Data Protection
Encryption in Transit: HTTPS/TLS 1.3
Encryption at Rest: Database encryption (Supabase default)
PII Encryption: Contact details encrypted until unlocked
Secure Headers:
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security

11.3 Privacy Compliance
GDPR Compliance:
User consent for data processing
Right to access data (download profile)
Right to erasure (delete account)
Data portability
Privacy policy (clear, accessible)
Cookie consent
Data Retention:
Active accounts: Indefinite
Deleted accounts: 30-day soft delete grace period
Anonymized data: Analytics (12 months)
Backups: 30 days

11.4 Security Best Practices
SQL Injection Prevention: Parameterized queries, Supabase RLS
XSS Protection: React default escaping, CSP headers
CSRF Protection: Server Actions, SameSite cookies
Input Validation: Client-side (Zod) + Server-side
Output Encoding: React default
Secure File Upload: File type validation, malware scanning (future)
API Rate Limiting: 100 requests/minute per IP
Dependency Security: npm audit, Dependabot

12. Launch Strategy & Rollout Plan
12.1 Pre-Launch Checklist
Technical:
[ ] All core features developed and tested
[ ] Performance optimization (Lighthouse >90)
[ ] Security audit completed
[ ] Database migrations ready
[ ] Payment integration tested (sandbox + live)
[ ] Email templates configured
[ ] Error tracking (Sentry) configured
[ ] Analytics (GA4) configured
[ ] SSL certificate installed
[ ] Domain configured (DNS)
Content:
[ ] Homepage copy finalized
[ ] Legal pages (Privacy, Terms, Refund) published
[ ] Help center/FAQ created
[ ] Email templates (welcome, verification, etc.)
[ ] Success stories (minimum 3)
Operations:
[ ] Admin accounts created
[ ] Admin training completed
[ ] Support email configured
[ ] Payment gateway live credentials configured
[ ] Backup strategy tested
[ ] Incident response plan documented

12.2 Launch Phases
Phase 1: Soft Launch (Weeks 1-2)
Goal: Test platform with limited users, gather feedback
Audience: Invite-only (friends, family, early adopters)
Target: 100-200 users
Activities:
Manual user onboarding
Close monitoring of user behavior
Bug fixing and performance tuning
Feedback collection (surveys, interviews)
Iterate on UX issues
Phase 2: Beta Launch (Weeks 3-6)
Goal: Expand to broader audience, validate product-market fit
Audience: Open registration (limited marketing)
Target: 500-1,000 users
Activities:
SEO optimization (indexing, content)
Basic paid ads (Google, Facebook)
Referral program
Email marketing to beta list
A/B testing (landing page, pricing)
Phase 3: Public Launch (Week 7+)
Goal: Full-scale launch, aggressive growth
Audience: Open registration (full marketing)
Target: 2,000+ users in first 3 months
Activities:
PR campaign (press releases, media coverage)
Influencer partnerships
Paid advertising scale-up
Content marketing (blog, SEO)
Social media campaigns
Partnerships with wedding vendors

12.3 Marketing Strategy
SEO:
Target keywords: "matrimonial sites", "marriage bureau", "bride groom search"
City-specific pages (e.g., "Delhi matrimonial", "Mumbai matrimonial")
Blog content (marriage advice, success stories, tips)
Paid Advertising:
Google Ads (Search, Display)
Facebook/Instagram Ads (demographic targeting)
YouTube Ads (awareness)
Content Marketing:
Blog posts (2-3 per week)
Success stories
Marriage guides
Video content (testimonials)
Referral Program:
Refer a friend: Both get ₹200 credit
Affiliate program (future)

12.4 Post-Launch Roadmap
Month 1-3:
Stabilize platform
Fix critical bugs
Onboard first 1,000 users
Achieve first 50 paid users
Collect feedback and iterate
Month 4-6:
Launch mobile apps (iOS, Android)
Add video call feature
Enhance matching algorithm (AI/ML)
Regional expansion (support more states/cities)
Month 7-12:
AI-powered compatibility scoring
Verification enhancements (video verification)
Community features (forums, events)
Partner integrations (astrology, horoscope matching)
International expansion

Conclusion
This PRD provides a comprehensive blueprint for building and launching the Prime Groups Matrimonial web application. The document covers all critical aspects: user and admin requirements, technical architecture, data models, payment flows, security, and launch strategy.
Key Success Factors:
Performance: Fast load times and smooth UX
Security: Robust data protection and privacy
Monetization: Clear value proposition for paid plans
Quality: Verified profiles and effective moderation
Growth: Scalable architecture for long-term expansion
Next Steps:
Technical design review with engineering team
Sprint planning and task breakdown
Wireframe and UI design
Development sprint execution
QA and user acceptance testing
Soft launch preparation

Document Approvals:
Role
Name
Signature
Date
Product Manager
[Name]
_______
_____
Engineering Lead
[Name]
_______
_____
Design Lead
[Name]
_______
_____
Business Stakeholder
[Name]
_______
_____


Version History:
Version
Date
Author
Changes
1.0
Feb 9, 2026
Claude
Initial PRD


End of Document

