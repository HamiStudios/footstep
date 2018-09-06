# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.2.2] - 06/09/2018

### Added
- Add pad() method to add padding to strings to make them the same length [#4](https://github.com/HamiStudios/footstep/issues/4)

### Changed
- Refactored code style. Now follows [Airbnb JavaScript style](https://github.com/airbnb/javascript) [WIP]

## [2.1.1] - 20/06/2018

### Added
- Added ability to use functions for logs as well as streams
- Added new bright and bright background colors and some new styles
- Added ability to use literals in `formats` which will just replace the expression in `format` as well as having functions
- Added support for suffix
- Added setOptions() method to logger so you can change options easily after creating a Logger instance
- Added tests for new logger features
- Added coveralls
- Added travis

### Changed
- Default log type colors
  + verbose is now magenta with white text
  + info is now bright cyan background with black text
  + error is now red background with white text
  + warning is now bright yellow background with black text
  + notice is now blue background with white text
  + debug is now white background with black text
  + log is still the same with no color
  + all logs now have spaces before and after the type to allow a more defined color
