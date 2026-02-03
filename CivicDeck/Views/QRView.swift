import SwiftUI

struct QRView: View {
    @State private var appear = false

    var body: some View {
        NavigationStack {
            ZStack {
                LinearGradient(colors: [AppTheme.ocean, AppTheme.mint.opacity(0.6)], startPoint: .topLeading, endPoint: .bottomTrailing)
                    .ignoresSafeArea()

                VStack(spacing: 20) {
                    VStack(spacing: 6) {
                        Text("Твій QR-код")
                            .font(AppFont.title(26))
                            .foregroundColor(.white)
                        Text("Показуй для підтвердження")
                            .font(AppFont.body(14))
                            .foregroundColor(.white.opacity(0.8))
                    }

                    QRPlaceholder()
                        .scaleEffect(appear ? 1 : 0.94)
                        .opacity(appear ? 1 : 0)
                        .animation(.spring(response: 0.6, dampingFraction: 0.7), value: appear)

                    VStack(spacing: 8) {
                        Text("Дійсний 3 хвилини")
                            .font(AppFont.caption(12))
                            .foregroundColor(.white.opacity(0.8))
                        Button("Оновити код") { }
                            .font(AppFont.body(14))
                            .foregroundColor(.white)
                            .padding(.vertical, 10)
                            .padding(.horizontal, 20)
                            .background(
                                Capsule().fill(Color.white.opacity(0.2))
                            )
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 80)
            }
            .navigationBarHidden(true)
            .onAppear {
                appear = true
            }
        }
    }
}

private struct QRPlaceholder: View {
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 2), count: 9)

    var body: some View {
        VStack(spacing: 10) {
            LazyVGrid(columns: columns, spacing: 2) {
                ForEach(0..<81, id: \\.self) { index in
                    Rectangle()
                        .fill(isDark(index) ? Color.black : Color.clear)
                        .frame(height: 10)
                }
            }
            .padding(18)
            .background(Color.white)
            .cornerRadius(18)
            .shadow(color: Color.black.opacity(0.2), radius: 16, x: 0, y: 10)
        }
    }

    private func isDark(_ index: Int) -> Bool {
        (index % 7 == 0) || (index % 5 == 0) || (index % 3 == 0 && index % 2 == 0)
    }
}

#Preview {
    QRView()
}


