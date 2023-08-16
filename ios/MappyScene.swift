//
//  MappyScene.swift
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-08-07.
//

import Foundation
import Combine
import Mappy

@objc(MappyScene)
final class MappyScene: NSObject {
  
  private var scene: Scene?
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
    scene = Scene(sceneInfo: venue)
    scene?.load()
      .receive(on: DispatchQueue.main)
      .sink(receiveCompletion: { completion in
          switch completion {
          case .finished: break
          case .failure(let error):
              print("error: \(error)")
            reject("error_code", "Scene load failed", error)
          }
      }, receiveValue: {
        resolve(venueInfo)
      })
      .store(in: &cancellables)
  }
}
