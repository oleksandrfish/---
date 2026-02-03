import Foundation

struct UserProfile {
    let fullName: String
    let phone: String
    let email: String
    let idNumber: String
    let address: String
    let initials: String

    var firstName: String {
        fullName.split(separator: " ").first.map(String.init) ?? fullName
    }
}

