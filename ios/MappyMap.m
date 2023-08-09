//
//  MappyMap.m
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-01.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MappyMap, NSObject)
RCT_EXTERN_METHOD(
  load: (NSDictionary *)info
  resolve: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)
@end
