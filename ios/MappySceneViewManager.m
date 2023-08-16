//
//  MappySceneViewManager.m
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-07.
//

#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(MappySceneViewManager, RCTViewManager)

RCT_EXTERN_METHOD(
  setScene:(nonnull NSNumber *)node
  venueInfo:(nonnull NSDictionary *)info
)

RCT_EXTERN_METHOD(
  rotateToNorth:(nonnull NSNumber *)node
)

RCT_EXTERN_METHOD(
  setInitialViewpoint:(nonnull NSNumber *)node
)

@end
