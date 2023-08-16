//
//  MappyMapView.m
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-03.
//

#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(MappyMapViewManager, RCTViewManager)

RCT_EXTERN_METHOD(
  setMap:(nonnull NSNumber *)node
  venueInfo:(nonnull NSDictionary *)info
)

RCT_EXTERN_METHOD(
  rotateToNorth:(nonnull NSNumber *)node
)

RCT_EXTERN_METHOD(
  setInitialViewpoint:(nonnull NSNumber *)node
)

@end
