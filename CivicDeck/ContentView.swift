import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Image(systemName: "person.text.rectangle")
                    Text("Документи")
                }

            ServicesView()
                .tabItem {
                    Image(systemName: "square.grid.2x2")
                    Text("Сервіси")
                }

            QRView()
                .tabItem {
                    Image(systemName: "qrcode")
                    Text("QR")
                }

            ProfileView()
                .tabItem {
                    Image(systemName: "person.crop.circle")
                    Text("Профіль")
                }
        }
        .accentColor(AppTheme.accent)
    }
}

#Preview {
    ContentView()
}

