import 'package:flutter_test/flutter_test.dart';

import 'package:austa_mobile/app.dart';

void main() {
  testWidgets('App renders smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const AustaApp());
    // Just verify the app can build without crashing.
    expect(find.byType(AustaApp), findsOneWidget);
  });
}
