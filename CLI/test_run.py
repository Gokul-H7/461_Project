import unittest
import run

class TestRun(unittest.TestCase):
    def test_calculate_metrics(self):
        # Test a sample URL
        result = run.calculate_metrics("https://www.npmjs.com/package/even")
        self.assertIn("NetScore", result)
        self.assertGreaterEqual(result["NetScore"], 0)
        self.assertLessEqual(result["NetScore"], 1)

    def test_invalid_url(self):
        result = run.calculate_metrics("https://invalid-url")
        self.assertEqual(result["NetScore"], 0)

if __name__ == "__main__":
    unittest.main()
