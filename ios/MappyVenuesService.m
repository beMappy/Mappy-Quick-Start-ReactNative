//
//  MappyVenuesService.m
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-07-25.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MappyVenuesService, NSObject)
RCT_EXTERN_METHOD(
  getVenues: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)
@end
