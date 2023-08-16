//
//  MappyVenuesService.swift
//  SnowMappyRN
//
//  Created by Afsar Shakeer on 2023-07-25.
//

import Foundation
import Mappy
import Combine

@objc(MappyVenuesService)
final class MappyVenuesService: NSObject {
  
  private var cancellables = Set<AnyCancellable>()
  private let venuesService = VenuesService()
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func getVenues(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock) {
    venuesService.getVenues()
        .receive(on: DispatchQueue.main)
        .sink(receiveCompletion: { completion in
            switch completion {
            case .finished: break
            case .failure(let error):
                print("error: \(error)")
              reject("error_code", "Venues get failed", error)
            }
        }, receiveValue: { venues in
          let venuesStrs = venues.map { $0.toDictionary() }
          resolve(venuesStrs)
        })
        .store(in: &cancellables)
  }
}
