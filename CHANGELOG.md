# Changelog
This file keeps track of all relevant change for every release.

## [Unreleased]
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