//
//  MappyMap.swift
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-01.
//

import Foundation
import Combine
import Mappy

@objc(MappyMap)
final class MappyMap: NSObject {
  
  private var map: Map?
  private var cancellables = Set<AnyCancellable>()
    
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func load(_ venueInfo: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) {
      
    let venue = Venue(from: venueInfo)!
    map = Map(mapInfo: venue)
    map?.load()
      .receive(on: DispatchQueue.main)
      .sink(receiveCompletion: { completion in
          switch completion {
          case .finished: break
          case .failure(let error):
              print("error: \(error)")
            reject("error_code", "Map load failed", error)
          }
      }, receiveValue: {
        resolve(venueInfo)
      })
      .store(in: &cancellables)
  }
}
