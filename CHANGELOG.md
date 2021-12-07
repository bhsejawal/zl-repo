# Changelog
This file keeps track of all relevant change for every release.

## [Unreleased]

## [5.31.0] - 2021-12-07
### Added
- Sharing hashtag support
- Reddit Share
- Improve public album
- Different pin for disabled habitats on map page
- Gift popup

### Changed
- Gift page layout update
- Update map image
- Increase spacing for share buttons for mobile
- Order of card tabs
- Update mobile break point
- Remove tooltip from zoom bar on mobile and tablets
- Focus on search input when search icon is clicked
- Update landing page gift section header

### Fixed
- Live talk tag does not appear on the map
- Camera controls can be used in full screen on mobile
- Hard edge of landing page background image
- Use html link for copy link share

## [5.30.0] - 2021-11-29
### Added
- Gift section on landing page
- Gift flow
- Gradient on gift page

### Changed
- Scheduler events support multiple cameras selection
- Revamp login/signup screen

### Fixed
- Scroll on gift page
- Mobile chat becomes unusable after clicking explore
- Fixes missing script on app template file
- Full screen for main video
- UI bugs with share page
- Trailer links do not appear in admin configuration window
- Schedules time reminder button paddings

## [5.29.0] - 2021-11-22
### Added
- Copy URL button for media sharing
- Try refreshing button when video does not load
- Habitat card modals are served with URL parameter

### Changed
- Update reaction color
- Update map to include banner and some enhancements
- Use thumbnail for images and clips
- Adjusting semaphore settings
- Search dropdown remove lock and show tag on mobile and desktop

### Fixed
- Set max 4 line for description
- Mobile emoji bubbles timing and functionality
- Schedule talks not showing in habitat tab
- Ensure onboarding text is always visible

## [5.28.0] - 2021-11-15
### Added
- Subscription cancellation popup
- Update account page to open tabs based on URL
- Multiple stream per habitats: fix database/logs structure
- Add navigation button between Login and Signup pages

### Changed
- Map page UI update
- Optimize sizing on habitat page for mobile
- Increasing emoji's time to 10 seconds

### Fixed
- Clip feature issues
- Subscription undefined discount property

## [5.27.0] - 2021-11-05
### Added
- Search bar for Mobile UI update
- Ability to watch trailers for freemium users
- Gradient to avoid carousel buttons blending with images on login

### Changed
- Increase card view time from 3 to 9 seconds
- Copy changes for chat
- Copy changes for login
- Manage subscription page loader
- Style changes to price page
- Update custom video control

### Fixed
- Schedules enhancements and fixes
- Clear clips data after first call

## [5.26.0] - 2021-11-01
### Added
-  Tooltips for interactive controls on desktop

### Changed
- Invite friend copy and button update
- Clip button has similar loading state to snapshot
- Schedule modal, event type dropdown list has a stream selected by default
- Update prices in FAQ

### Fixed
- Invite modal style fixes

## [5.25.0] - 2021-10-26
### Added
- Album on full screen for mobile
- Schedule UI shows live talks
- Refactoring habitat trailer and add it to the map page
- Upgrade link to freemium habitat page and update styling
- Update the hasWatchedFreemiumTalk when a user in Freemium watch a live talk
- Signup and login UI update

### Changed
- NPS notification is triggered after 1 min from entering a habitat
- End pricing experiment
- Remove search and album click indicators

### Fixed
- Add card modal borders
- Chat init scroll issue when media is not loaded
- Remove deprecated host video mode on Power Modal

## [5.24.0] - 2021-10-18
### Added
- Edit controls to the Schedule tab

### Changed
- Update copy for PMMC popup
- Album tab is selected by default, set clips to be open by default
- Reactions background is set to white
- Move close button to the top corner for modals
- Habitat image resolution requirement
- Plans page UI updates
- Adjust static viewer number to be random

### Fixed
- Shorten timestamp in chat and posts to prevent long usernames from stacking
- Fixing styling for alternate chat reactions

## [5.23.0] - 2021-10-12
### Added
- Schedule tab UI update
- PMMC Info modal

### Changed
- Improve lighthouse performance score for zoolife
- Album tab is selected by default
- Go live button is bellow weather Widget

### Fixed
- Hide delete button for none admin users that didn't post the Q&A

## [5.22.0] - 2021-10-05
### Added
- Chat shows video preview url instead of a video
- Update the tab System
- Allow Q&A report and delete by same user or admin

### Changed
- Show mobile controls for medium screens smaller than 768px
- End landing page experiment
- API now returns schedule overlaps
- Live talk dimensions updated
- Hiring link on the landing page updated
- Socket IO upgrade

### Fixed
- Date picker layout is scrollable for small screens
- Snapshot modal
- Send button on chat on safari
- Calendar date timezone issue
- Max width of schedule events modal
- Search bar width for small phones

## [5.21.0] - 2021-09-27
### Added
- Show viewers count on cards, images and videos
- Implement the What's new popup 
- Implement Q&A
- Implements Badge System on the chat

### Changed
- Only admin should see card stats
- Enhance video controls in media modal
- Update click indicators and welcome message to be shown one time only and store that in DB
- Update search bar layout width, spacing and alignment 
- Decrease the size of the close button for all modals for mobile screens

## [5.20.0] - 2021-09-20
### Added
- Logs on GA when user clicks on an album tabs and images
- Opening media modal when clicking on a media on the chat
- Chat allow users to reply to another messages
- Allow users to report chat messages
- Adds UI to cancel subscriptions

### Changed
- Increase number of media itens retrieved from API
- On visibility change, app should restart on mobile
- Update time to see feedback notification to 10 min
- Updates live talk image on the landing page
- Increases habitat trailer to 12mb
- Show rate notification one time a month per platform (desktop/mobile)
- Update share content modal header

### Fixed
- Move camera switch and power models to an upper level component to prevent unmount when stream status changes
- Fix grommet drop rendering issue

## [5.19.0] - 2021-09-13
### Added
 - Click indicator on the search bar and the album tab
 - Details popup for the class pass
 - Link to all habitat cards

### Changed
 - Responsiveness across the application
 - Habitat Trailer UI

### Fixed
 - Issue with Schedule Popup not showing all the info
## [5.18.0] - 2021-09-08

### Added
 - Viewers count on the habitat pages
 - Support to switch camera on habitats that has more than one camera
 - Admin page to download product metrics
 - After a user rates the application, we now prompt them to offer feedback
### Fixed
 - Issue with scroll that would affect some browsers
 - Issue on the chatbox that would hide the text behind the emote button on some browsers
 - Issue with alignment on the pricing page

 ### Changed
  - We removed the Schedule Card from the top of the chat and extended the weather widget to show the schedule data

## [5.17.0] - 2021-09-01
### Added
 - Support for the freemium experience
 - A public price page
 - Support for host mode on mobile
 - Santa Barbara Zoo landing page
 - A/B test for the toronto zoo page
 - Is Freemium and Freemium Priority to the Admin Dashboard
### Changed
 - Partner logo can also be a PNG file now
 - Desktop uses the same onboarding process as mobile
 - Minor changes on the landing page (copies, scrolling image, and spacing)
 - Plans/Subscription manage page layout
 - Start Trial is now triggered from the Freemium Onboarding page

### Fixed
 - An issue on the profile check which allowed mobile users to not have to go through the Start Trial process
 - Small css/logic issues on the video player within the UGC modal

## [5.16.0] - 2021-08-23
### Added
 - Facebook Pixel integration

### Changed
 - Added productId to the webrtc logs and changed the periodicity from 30s to 5s
 - Share Modal now uses the public HTML again

### Removed
 - A/B Experiment from the Landing Page
### Fixed
 - Issue with css on the Share Media modal when viewing a clip
 - A few typos on the landing page


## [5.15.0] - 2021-08-13
### Added
- Next button on the offline content container
- Endless scroll image on the landing page
### Changed
- Floating button text on the landing page
- Set up new price experiment

## [5.14.0] - 2021-08-06
### Added
- Clipping feature is now available on Mobile
- Public content page is now live and content modal share links to it
- Cancel button on Snapshot Modal, which will delete the photo on cancel
### Changed
- Updated the Website title for SEO
- Habitats Updater will now get new state every minute instead of every five minutes
- 'Click to move' indicator styling
- Offline image can be up to a mb and should be jpeg/jpg
- Increased event title for schedules to 50 chars
- Pink button on the landing page will show on scroll
- CSS for custom text on partner landing pages
- After capture a photo/clip, the Content Modal will be displayed instead of the Share Modal.

### Fixed
- Issue where calendar would not be updated on habitat change

## [5.13.0] - 2021-08-03
### Added
- Offline mode on habitats
- New onboarding for mobile
- Partners page have specific hero section
- Multiple logs to track user behaviour
- Custom video controls to all videos
- NPS modal on the habitat page
- Pulsing animation to the clip button
- A "tap to move" element on mobile to stimulate users to interact with the video
### Changed
- Increased timeout on clip trim/creation to match API
- Scheduler page logos are now round
- Updated the styling for the weather widget


### Fixed
- Wrong style for button on the landing page
## [5.12.0] - 2021-07-26

### Added
- Implemented Toast System
- Fallback for Paused Livestream on Habitat Page
- A/B test on the Hero section

### Changed
- User Agent is now sent on Login/Signup
- Max width to 1920px
- Experiment ID for the Plans Page
- Layout of the Tab Selector on the Album Component
- Hero section layout on the landing page

### Fixed
- An issue where on habitat navigation, the state would not be fully cleaned up
- An issue where users on iPhone would be stuck without the video when the device was in low power mode

## [5.11.0] - 2021-07-20

### Added
- Carousel on the Signup page
- Support to share clips on the chat
- WebRTC logs now includes User Agent
### Fixed
- Formatting issue on the Schedule Card
- Hide/Download button issue on album pages
- Issue where main chat would display message posted on UGC
- Session issue on Login/Signup pages
- Zoom issue when a user focus on an input on iOS

### Changed
- Layout on the plans page
- USA is now named US on the country list
- Map page title on mobile devices
- Map page on mobile now uses the Habitat Title instead of the Species name
## [5.10.0] - 2021-07-19

### Added
- User can now comment and like photos and clips
- Habitat show a welcome message on the chat when a user joins
- When taking a photo, the photo is shared on the chat
- Logging user interaction data on Google Analytics
- Habitat preview video on the sheduler carousel
- Live talk notification when a host goes online
- Users can now add a title on photos
- Camera selection when creating a livestream schedule

### Fixed
- Landing page formatting issue with the email addresses on the Footer
- Multine issue on safari on chat
- Issue with Keyboard being on top of content on chat page

### Changed
- Copy adjustments on the Landing page
- Remove the feature section from the album page
- Increased the max length on the video card to 150 chars
## [5.9.0] - 2021-07-09
### Added
- Users can now react to chat messages
- Device type to the webrtc logs
- A/B experiment for price, and few changes on the price page
- Landing page for PMMC Summer Camps
- Enhanced talk cards

### Fixed
- Issue with fullscreen mode on chrome

## [5.8.2] - 2021-07-07
### Fixed
- Issue where signed-up event would be fired when signing up with email
- Layout issue when habitat is offline

## [5.8.1] - 2021-07-06
### Added
- Add clips to the album section on the habitat page
- Tooltip for the Live Now bar

### Changed
- Enhance welcome page responsive layout
- Camera control works on when video is full screen
- Increasing padding on the arrow in the live habitats expanded view

### Fixed
- Date picker for calendar schedule events
- Invite modal dual instances
- Schedule cards, maps, and live now bar are not showing Live Talks

## [5.8.0] - 2021-07-02
### Added
- Enchanced bundle size, pre-loading onboarding video on map page, and pre-caching/loading optimizations
- Habitat info is now updated on camera changes
- Public content share page
- Added fullscreen control on the host Videos
- Delete button on the Habitats/Partners admin pages
- Clip Capture Experience

### Changed
- Increased the cursor area on the livestream container
- Header now has better responsiveness
- Discount text to August 1st
- Share logs are now done through HTTP requests
### Removed
- Download button from the live talks

### Fixed
- Issue where images would show Month instead of Day on its title
- Issue where custom control was triggering Play Started logic twice on videos


## [5.7.0] - 2021-06-24
### Added
- Timeout of 2s before sending GA Hits
- Implement the "scroll for content" element on the habitat only for desktops
- Fullscreen button to the main video container
- Live talk label to the live talk bar

### Changed
- Update filters and calendar dropdowns in schedule page
- Use grommet select and update it across application
- Onboarding video
- Blur habitat search input on selection
- Full burger menu list items are clickable
- Users with permissions should be able to delete live events
- Admin tables show pass and last login dates in local time
- Increasing circles size on Body Cards when on Mobile
- Different routing and proxy
- Mobile users no longer gets redirect to mobile page after signup

### Fixed
- Welcome page after pass purchasing mobile layout bugs
- Fixing header styling for phones
- Bullet list is aligned with the title in landing page section 3
- Adjusting Dialog for better mobile UI
- CSS adjustments on Habitat Profile area
- Using 1 pixel empty png as cursor for Cursor Container to fix issue on Windows
- Fixing transparent success background on invite modal
- My Character icon popup mobile enhancement
- Space on top of the chat container
- Layout fixes for subscription page
- Reset cards progress on cards load/change
- disappearing mobile menu icons
- Habitat page on older Safari versions
- Brief loading page render while moving from home to loading page
- Login/Signup page formatting, spacing and font styling
- White line on the side of the habitat stream, red line on loading screen

## [5.6.0] - 2021-06-18
### Added
- Integrating mouseflow
- Album Download raw image button, delete/undelete content button
- Album mobile View
- Welcome page mobile view
- Host Video is available for mobile
- Mobile emoji bubble
- Emote bar on the habitat page for mobile devices

### Changed
- Update env variable for isDev check
- Cards improvements
- Performance improvements
- Update modals with reusable components for consistency
- Redirect to mobile is skipped on dev env
- Update Cards UI on Mobile
- Grommet update
### Fixed
- Close mobile modals on unmount [PT178587179]
- Calendar mobile popup
- Reset password page image
- Habitat page tabs size
- Habitat mobile trial bar layout, and onboarding layout
- Mobile habitat card, mobile popup size, no data handling
- Stuck cursor after click on touch devices

## [5.5.0] - 2021-06-11
### Added
- Mobile version of the Account Tab
- Mobile version of the Map Page
- Mobile version of the Plans Page
- Pins to the desktop version of the Map Page
- Google Tag Manager
- A/B Test for the video on the hero section, and the Meet the Animals button
- Error handling for social login
- Popup on the habitat page if take picture process fails
- Delete message functionality
- Contact us button on the Livestream container

### Changed
- Invite popup will no longer auto trigger on mobile devices
- Modals are now consistent on mobile devices
- Max height for maps cards
- Image on the signup page
- Added the We're hiring link on the landing page
- Text changes on the landing pages
- Better usage of space when trial bar is not visible
### Fixed
- Minutes Spent on Users Page is now showing the proper values
- Fixed terms and privacy popup on the signup page to show the proper files
- Removed unnecessary empty space on the habitat page when using tablets
- Schedule Cards on the habitat page will no longer move if a user user the arrows on the keyboard
- Issue with the load more button on the album component when using Safari

## [5.4.0] - 2021-06-04
### Added
- Trial time bar improvements for mobile and style changes
- Schedule page mobile
- Update user timzone if its differnet than stored in DB
- Mobile controls (zoom and camera)
- Send the userId and host stream key to the api when a host starts streaming
- Mobile calendar
- New animals label in landing page
- add preview image for album videos
- Snapshot button loading state
- Implement Album for Photos on Habitat Page
- Implementing react-optimize and hero video AB test
- Habitat page Responsive support

### Changed
- Chat auto scroll enhancement
- Skip welcome page on mobile
- Allow ignore www. in asset and origin comparison
- Update max length for habitat name to be as on admin page
- Update overlay size validation to 300KB
- Update discount to Jun 30th
- Logged in users should be redirected to the map page instead of the landing when clicking on Signup
- Deploy with "cp" instead of "sync"
- Hide admin controls on mobile

### Fixed
- Admin users switching a user roles issues
- Front end errors for newly added habitats
- Analytics not receiving the signed-up event for emails
- Mobile cards autoplay

## [5.3.0] - 2021-05-27
### Changed
- Improved chat experience, with message limiting, and timestamps on messages
- Included ga-react to send hits directly to GA instead of proxying it through Segments

## [5.2.0] - 2021-05-21
### Added
- Mail links on landing footer
- Google optimize
- Favorite Page for Mobile

### Changed
- Make share popup larger
- Subscribe working on enter key
- Refactoring live talks bar and increasing font-size on the chat
- Trial starts when users setup their profile
- Stream Setting button is visible to admin/partner even when stream is off
- Move to map after closing mail success modal
- Header update and some mobile fixes
- Refactor Data Gathering for Analytics/Better marketing analysis
- Family members age layout
- Increase padding to right of map on map page
- Onboarding video container click will not close modal
- Copy changes for login page
- Landing page logo is moved to the left
- Schedule rule updates after server refactor
- Habitats list is updated without refresh
- Schedule, favorite, and map accessible after trial expiry
- Align profile cards to the top
- Replaced overlay placeholder image
- Open invite modal 2 minutes before trial expiry
- Promo text to be until jun 1st
- Partner logo constraints update

### Fixed
- Un-styled header flash on home page
- Vertical scroll on trial bar
- Videos are not loading on Safari (old versions and iPadOs)
- Emoji alignment, and size fix when dropped
- Broken search bar on safari
- Chat scroll fixes for windows browsers
- Wrong url for reset password
- Error when there are no active cameras for an event

## [5.1.0] - 2021-05-14
### Added
- Allow association of habitats to Hosts
- Add Time spent on User Admin Dashboard
- Habitat search show search suggestions on focus
- Custom service worker registration
- Loading wheel when moving camera is based off of voting time
- Add text length validation to the Admin tables
- Adding twitch endpoint
- Adding segment id to terms and privacy pages
- Robots file
- Privacy and terms pages
- Image upload bug fixes, and overlay improvement
- Text area support for admin tables
- Missing ENV key to .env.sample
- Saving referral data on local storage and sending on signup
- Allowing all users to go to plans page and resetting button on pass expire
- Section 1 Animated looping text
- Adding another url to Orana zoo

### Changed
- Force websocket transport protocol
- Increase species max to 32
- Search and minor refactoring for header and map page
- Using origin instead of assets distribution
- Update partner logo
- Enhance scroll logic for chat
- Renaming USA on the countries
- Separated  homepage from the app
- Updated auto deployment branch
- Refactor add new user popup from admin/user page
- Enforcing path and url for segments as its not properly setting on prod
- Adjusting text lengths, copy, and char count on the edit modal
- Renaming Orana Park title
- Mobile redirect changes, and page titles update
- Trial bar support date time
- All files are served from the assets distribution

### Fixed
- Habitat search Show search suggestions on focus
- Habitat search display results on 1+ character inputs
- Cards shortcuts bug fixes
- Taken photo popup style fixes
- Update text size for map edit
- Add new item in admin table
- Hiding disabled zoos from select list for partners
- Reverted template.html to load segment for dev build
- Added missing 404 page
- PDF page fix to terms and privacy pages
- Host UI buttons color & alignment are off
- Habitat search
- Removing highlight color on android devices
- Large image issue on account page on safari
- Text alignment on the favorite page
- Permissions for hosts and partners
- Image upload bug fixes, and overlay improvement
- Set max width of onboarding video as 80%
- Logo Image size fix
- Hiding preview tag when broadcaster is live but there is no live talk
- Issues with Broadcast/Livetalk pausing when users scroll on the carousel
- Disable animation on landing page because of safari support
- Reference to zooId
- Remove spaces from privacy policy and terms and condition links
- Fix webRTC log
- Terms and conditions height on safari
- Header logo overlap and link it to landing page
- Trial bar should not render if role is not user

## [5.0.0] - 2021-04-23
