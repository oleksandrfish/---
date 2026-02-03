import SwiftUI

struct ServicesView: View {
    private let services = MockData.services
    @State private var appear = false

    private let columns = [
        GridItem(.adaptive(minimum: 150), spacing: 16)
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.bgGradient.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Сервіси")
                            .font(AppFont.title(28))
                            .foregroundColor(.white)
                            .padding(.top, 8)

                        LazyVGrid(columns: columns, spacing: 16) {
                            ForEach(Array(services.enumerated()), id: \\.element.id) { index, service in
                                ServiceCard(service: service)
                                    .opacity(appear ? 1 : 0)
                                    .offset(y: appear ? 0 : 12)
                                    .animation(.easeOut(duration: 0.5).delay(Double(index) * 0.05), value: appear)
                            }
                        }
                        .padding(.top, 6)
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 90)
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                withAnimation(.easeOut(duration: 0.6)) {
                    appear = true
                }
            }
        }
    }
}

#Preview {
    ServicesView()
}


