import re, sys

class Predictor():
	def __init__(self):
		self.keys = {
				'a':  'qaz', 
				's': 'wsx', 
				'd': 'edc', 
				'f':'rfvtgb', 
				'j': 'yhnujm', 
				'k': 'ik,', 
				'l': 'ol.', 
				';': 'p;/', 
				}
		self.m = dict((l, str(k)) for k,v in self.keys.items() for l in v)
		self.data, self.ocurrences = {}, {}
		self.wmatch = re.compile('[^a-z]+')

	def train(self, f):
		for word in self.wmatch.split(f.read().lower()):
			self._learn(word)

		for key, value in self.keys.items():
			for character in value:
				self._learn(character)
			self._learn(key)

	def search(self, n):
		if not n in self.data:
			return []

		results = ([], [])
		for match in self.data[n]:
			results[int(len(match) != len(n))].append((match, self.ocurrences[match]))
		return list(dict(results[0]).keys())


	def _learn(self, word):
		if not word in self.ocurrences:
			num = ''.join(self.m[c] for c in word)
			for i in range(1, len(word) + 1):
				inp = num[:i]
				if inp not in self.data:
					self.data[inp] = set([word])
				else:
					self.data[inp].add(word)
		self.ocurrences[word] = 1
